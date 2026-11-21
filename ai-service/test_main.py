from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_check():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["service"] == "PetCare AI Engine"


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
                "historical_sales_30d": [3] * 30,
            }
        ]
    }
    res = client.post("/api/forecast/predict", json=payload)
    assert res.status_code == 200
    proposals = res.json()
    assert len(proposals) == 1
    assert proposals[0]["sku"] == "RC-001"
    assert proposals[0]["suggested_quantity"] >= 10
    assert 0.85 <= proposals[0]["confidence_score"] <= 0.98


def test_multi_year_seasonal_demo():
    res = client.get("/api/forecast/multi-year-seasonal")
    assert res.status_code == 200
    data = res.json()
    assert data["total_months_analyzed"] == 20
    assert len(data["seasonal_forecasts"]) == 6


def test_order_history_predict_empty_returns_400():
    res = client.post(
        "/api/forecast/order-history-predict",
        json={"order_history": [], "target_months_ahead": 3},
    )
    assert res.status_code == 400
