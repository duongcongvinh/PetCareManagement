from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_check():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["service"] == "PetCare AI Engine"
    assert data["ml_libraries_active"] is True


def test_predict_reorder_needs():
    payload = {
        "products": [
            {
                "product_id": "p1",
                "sku": "RC-001",
                "product_name": "Royal Canin Poodle",
                "current_stock": 5,
                "min_stock_level": 15,
                "max_stock_level": 50,
                "lead_time_days": 5,
                "cost_price": 180000,
                "historical_sales_30d": [3] * 30,
            },
            {
                "product_id": "p2",
                "sku": "SAFE-002",
                "product_name": "Bát ăn Inox",
                "current_stock": 80,
                "min_stock_level": 10,
                "max_stock_level": 100,
                "lead_time_days": 4,
                "historical_sales_30d": [1] * 30,
            },
        ]
    }
    res = client.post("/api/forecast/predict", json=payload)
    assert res.status_code == 200
    proposals = res.json()
    assert len(proposals) == 1
    p = proposals[0]
    assert p["sku"] == "RC-001"
    assert p["suggested_quantity"] >= 10
    assert 0.85 <= p["confidence_score"] <= 0.98
    assert p["urgency"] == "CRITICAL"
    assert p["days_of_cover"] < 5.0
    assert p["estimated_restock_cost"] > 0


def test_multi_year_seasonal_demo_and_metrics():
    res = client.get("/api/forecast/multi-year-seasonal")
    assert res.status_code == 200
    data = res.json()
    assert data["total_months_analyzed"] == 20
    assert len(data["seasonal_forecasts"]) == 6
    assert data["yearly_growth_rate"] > 0.1

    metrics = data["model_metrics"]
    assert 0.0 <= metrics["mape"] <= 35.0
    assert 0.5 <= metrics["r2_score"] <= 1.0
    assert metrics["backtest_months"] >= 3

    fi = data["feature_importance"]
    assert len(fi) == 4
    assert abs(sum(item["importance_pct"] for item in fi) - 100.0) <= 0.5

    # Xác nhận khoảng tin cậy 95% hợp lệ (low <= predicted <= high)
    for f in data["seasonal_forecasts"]:
        assert f["predicted_revenue_low"] <= f["predicted_revenue"] <= f["predicted_revenue_high"]


def test_multi_year_seasonal_what_if_scenario():
    base_res = client.get("/api/forecast/multi-year-seasonal").json()
    # Chạy cùng dữ liệu nhưng bật kịch bản tăng khuyến mãi +20% và nhiệt độ +3°C
    demo_records = [
        {"year": 2022 + (i // 12), "month": (i % 12) + 1, "revenue": 50000000 + i * 2500000 + (15000000 if (i % 12 + 1) in (6, 7, 12, 1) else 0)}
        for i in range(36)
    ]
    res_base = client.post(
        "/api/forecast/multi-year-seasonal",
        json={"historical_months": demo_records, "target_months_ahead": 6},
    )
    res_boost = client.post(
        "/api/forecast/multi-year-seasonal",
        json={
            "historical_months": demo_records,
            "target_months_ahead": 6,
            "temp_delta_c": 3.0,
            "promo_boost_pct": 20.0,
        },
    )
    assert res_base.status_code == 200 and res_boost.status_code == 200
    assert res_boost.json()["scenario_applied"]["is_simulated"] is True
    base_total = sum(f["predicted_revenue"] for f in res_base.json()["seasonal_forecasts"])
    boost_total = sum(f["predicted_revenue"] for f in res_boost.json()["seasonal_forecasts"])
    assert boost_total > base_total
    assert base_res["total_months_analyzed"] == 20


def test_order_history_predict_deterministic_and_real_months():
    monthly_summary = [
        {
            "year": 2024 + (i // 12),
            "month": (i % 12) + 1,
            "salesRevenue": 100000000 + i * 3000000,
            "importCost": 60000000 + i * 1800000,
            "salesOrderCount": 140,
            "importOrderCount": 4,
            "productsSold": 450 + i * 10,
        }
        for i in range(24)
    ]
    product_sales = [
        {
            "productId": "prod-1",
            "productName": "Hạt Royal Canin Mini Adult (2kg)",
            "year": 2024 + (i // 12),
            "month": (i % 12) + 1,
            "quantity": 60 + i,
            "revenue": (60 + i) * 320000,
        }
        for i in range(24)
    ]
    current_products = [
        {
            "id": "prod-1",
            "name": "Hạt Royal Canin Mini Adult (2kg)",
            "sku": "RC-MINI-2KG",
            "category": "Thức ăn",
            "currentStock": 6,
            "minStockLevel": 15,
            "maxStockLevel": 100,
            "unitPrice": 320000,
            "costPrice": 210000,
            "leadTimeDays": 4,
            "supplierName": "Royal Canin Việt Nam",
        }
    ]
    payload = {
        "monthly_summary": monthly_summary,
        "product_sales": product_sales,
        "current_products": current_products,
        "target_months_ahead": 3,
    }
    res1 = client.post("/api/forecast/order-history-predict", json=payload)
    res2 = client.post("/api/forecast/order-history-predict", json=payload)
    assert res1.status_code == 200 and res2.status_code == 200
    d1, d2 = res1.json(), res2.json()
    # Phải tất định 100% (không random) và đếm đúng 24 tháng thực tế
    assert d1["monthsAnalyzed"] == 24
    assert d1["predictedRevenueNextMonth"] == d2["predictedRevenueNextMonth"]
    assert len(d1["recommendations"]) == 1
    assert d1["recommendations"][0]["urgency"] == "CRITICAL"
    assert d1["recommendations"][0]["suggestedImportQty"] > 0


def test_order_history_predict_empty_returns_400():
    res = client.post(
        "/api/forecast/order-history-predict",
        json={"order_history": [], "target_months_ahead": 3},
    )
    assert res.status_code == 400
