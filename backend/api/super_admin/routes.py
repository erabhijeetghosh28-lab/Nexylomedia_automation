from datetime import datetime, timedelta

from flask import jsonify

from backend.api.super_admin import super_admin_bp


@super_admin_bp.route("/overview", methods=["GET"])
def super_admin_overview():
    """Return aggregate platform metrics for the super admin dashboard."""
    now = datetime.utcnow()
    return jsonify(
        {
            "success": True,
            "metrics": {
                "total_tenants": 42,
                "active_users": 318,
                "api_usage_today": 18320,
                "ai_tokens_month": 624_000,
                "open_incidents": 1,
            },
            "system_health": [
                {
                    "service": "n8n Workflows",
                    "status": "healthy",
                    "last_checked": now.isoformat(),
                },
                {
                    "service": "PageSpeed API",
                    "status": "warning",
                    "message": "80% of daily quota used",
                    "last_checked": now.isoformat(),
                },
                {
                    "service": "Gemini AI",
                    "status": "healthy",
                    "last_checked": now.isoformat(),
                },
            ],
            "recent_activity": [
                {
                    "timestamp": (now - timedelta(minutes=12)).isoformat(),
                    "entity": "Acme Retail",
                    "action": "triggered prospect import",
                    "actor": "system",
                },
                {
                    "timestamp": (now - timedelta(hours=1, minutes=4)).isoformat(),
                    "entity": "Luna Cosmetics",
                    "action": "upgraded to Growth plan",
                    "actor": "billing-service",
                },
                {
                    "timestamp": (now - timedelta(hours=2)).isoformat(),
                    "entity": "Nexylomedia HQ",
                    "action": "ran SEO audit (mobile + desktop)",
                    "actor": "automation",
                },
            ],
        }
    )


@super_admin_bp.route("/tenants", methods=["GET"])
def list_tenants():
    """Return mock tenant catalogue with usage and plan data."""
    now = datetime.utcnow()
    return jsonify(
        {
            "success": True,
            "tenants": [
                {
                    "id": "tenant-001",
                    "name": "Nexylomedia HQ",
                    "plan": "Enterprise",
                    "status": "active",
                    "users": 24,
                    "created_at": (now - timedelta(days=320)).isoformat(),
                    "usage": {"api_calls": 128_400, "ai_tokens": 312_000},
                },
                {
                    "id": "tenant-002",
                    "name": "Acme Retail",
                    "plan": "Growth",
                    "status": "trial",
                    "users": 8,
                    "trial_ends_at": (now + timedelta(days=7)).isoformat(),
                    "usage": {"api_calls": 24_800, "ai_tokens": 46_000},
                },
                {
                    "id": "tenant-003",
                    "name": "Luna Cosmetics",
                    "plan": "Starter",
                    "status": "active",
                    "users": 5,
                    "created_at": (now - timedelta(days=120)).isoformat(),
                    "usage": {"api_calls": 12_100, "ai_tokens": 18_500},
                },
            ],
        }
    )


@super_admin_bp.route("/tenants/<tenant_id>", methods=["GET"])
def tenant_detail(tenant_id: str):
    """Return mock tenant detail view."""
    now = datetime.utcnow()
    return jsonify(
        {
            "success": True,
            "tenant": {
                "id": tenant_id,
                "name": "Sample Tenant",
                "plan": {
                    "name": "Growth",
                    "renewal_date": (now + timedelta(days=23)).isoformat(),
                    "monthly_cost": 149.0,
                },
                "usage_trend": {
                    "api_calls": [6800, 7200, 7500, 7900, 8200, 8600],
                    "ai_tokens": [52_000, 54_500, 57_200, 59_000, 61_300, 64_800],
                },
                "integrations": [
                    {"name": "Google PageSpeed", "status": "connected"},
                    {"name": "Gemini AI", "status": "connected"},
                    {"name": "Google Ads", "status": "pending"},
                ],
                "recent_logs": [
                    {
                        "timestamp": (now - timedelta(minutes=30)).isoformat(),
                        "severity": "info",
                        "message": "SEO audit completed (mobile).",
                    },
                    {
                        "timestamp": (now - timedelta(hours=3)).isoformat(),
                        "severity": "warning",
                        "message": "PageSpeed quota at 75%.",
                    },
                ],
            },
        }
    )


@super_admin_bp.route("/billing/history", methods=["GET"])
def billing_history():
    """Return mock invoice history."""
    now = datetime.utcnow()
    return jsonify(
        {
            "success": True,
            "invoices": [
                {
                    "invoice_id": "INV-2025-001",
                    "tenant": "Nexylomedia HQ",
                    "amount": 499.0,
                    "status": "paid",
                    "issued_at": (now - timedelta(days=12)).isoformat(),
                },
                {
                    "invoice_id": "INV-2025-002",
                    "tenant": "Acme Retail",
                    "amount": 199.0,
                    "status": "open",
                    "issued_at": (now - timedelta(days=5)).isoformat(),
                },
            ],
        }
    )


@super_admin_bp.route("/audit-logs", methods=["GET"])
def audit_logs():
    """Return mock admin activity log entries."""
    now = datetime.utcnow()
    return jsonify(
        {
            "success": True,
            "logs": [
                {
                    "timestamp": (now - timedelta(minutes=10)).isoformat(),
                    "actor": "abhijeet@platform.io",
                    "action": "Impersonated tenant Nexylomedia HQ",
                    "ip": "127.0.0.1",
                },
                {
                    "timestamp": (now - timedelta(hours=2)).isoformat(),
                    "actor": "automation@platform.io",
                    "action": "Rotated Gemini API key for Luna Cosmetics",
                    "ip": "10.0.0.6",
                },
                {
                    "timestamp": (now - timedelta(days=1)).isoformat(),
                    "actor": "abhijeet@platform.io",
                    "action": "Disabled Ads Integration for Acme Retail",
                    "ip": "127.0.0.1",
                },
            ],
        }
    )

from __future__ import annotations

from datetime import datetime, timedelta

from flask import jsonify

from . import super_admin_bp


def _now() -> datetime:
    return datetime.utcnow()


@super_admin_bp.route("/dashboard", methods=["GET"])
def dashboard_overview():
    """Return high-level metrics for the super admin landing page."""
    data = {
        "kpis": [
            {"label": "Total tenants", "value": 28, "change": "+3", "trend": "up"},
            {"label": "Active users", "value": 412, "change": "+26", "trend": "up"},
            {"label": "API usage (24h)", "value": "68k", "change": "+12%", "trend": "neutral"},
            {"label": "Automation failures", "value": 2, "change": "-4", "trend": "down"},
        ],
        "system_health": {
            "n8n": {"status": "operational", "last_heartbeat": _now().isoformat() + "Z"},
            "pagespeed_quota": {"used": 72, "limit": 100},
            "ai_tokens": {"used": 420_000, "limit": 600_000},
        },
        "recent_activity": [
            {
                "timestamp": (_now() - timedelta(minutes=25)).isoformat() + "Z",
                "type": "tenant_signup",
                "tenant": "Northwind Retail",
                "message": "New tenant created on Growth plan.",
            },
            {
                "timestamp": (_now() - timedelta(hours=2)).isoformat() + "Z",
                "type": "alert",
                "tenant": "Acme Logistics",
                "message": "Automation flow failed 3 times in a row.",
            },
            {
                "timestamp": (_now() - timedelta(hours=5)).isoformat() + "Z",
                "type": "billing",
                "tenant": "Signal Studio",
                "message": "Invoice INV-2025-1102 marked as overdue.",
            },
        ],
    }
    return jsonify(data), 200


@super_admin_bp.route("/tenants", methods=["GET"])
def tenants_list():
    tenants = [
        {
            "id": "tn-001",
            "name": "Nexylomedia HQ",
            "plan": "Enterprise",
            "users": 32,
            "status": "active",
            "last_active": (_now() - timedelta(minutes=10)).isoformat() + "Z",
            "usage": {"api": 12000, "automations": 98, "ai_tokens": 82000},
        },
        {
            "id": "tn-002",
            "name": "Acme Retail",
            "plan": "Growth",
            "users": 14,
            "status": "active",
            "last_active": (_now() - timedelta(minutes=47)).isoformat() + "Z",
            "usage": {"api": 5200, "automations": 32, "ai_tokens": 21000},
        },
        {
            "id": "tn-003",
            "name": "Signal Studio",
            "plan": "Starter",
            "users": 6,
            "status": "delinquent",
            "last_active": (_now() - timedelta(hours=8)).isoformat() + "Z",
            "usage": {"api": 980, "automations": 5, "ai_tokens": 1500},
        },
    ]
    return jsonify({"tenants": tenants}), 200


@super_admin_bp.route("/tenants/<tenant_id>", methods=["GET"])
def tenant_detail(tenant_id: str):
    detail = {
        "id": tenant_id,
        "name": "Nexylomedia HQ" if tenant_id == "tn-001" else "Sample Tenant",
        "plan": "Enterprise",
        "plan_renewal": (_now() + timedelta(days=18)).date().isoformat(),
        "owner": {"name": "Abhijeet Ghosh", "email": "abhijeet@nexylomedia.com"},
        "usage": {
            "api_calls": {"used": 182_000, "limit": 250_000},
            "ai_tokens": {"used": 120_000, "limit": 180_000},
            "automations": {"used": 430, "limit": 600},
        },
        "integrations": [
            {"name": "Google PageSpeed", "status": "connected"},
            {"name": "Gemini AI", "status": "connected"},
            {"name": "Meta Ads", "status": "disconnected"},
        ],
        "recent_activity": [
            {
                "timestamp": (_now() - timedelta(hours=2)).isoformat() + "Z",
                "message": "Campaign 'Holiday Promo' activated.",
            },
            {
                "timestamp": (_now() - timedelta(hours=6)).isoformat() + "Z",
                "message": "Lead import job completed (79 records).",
            },
        ],
    }
    return jsonify(detail), 200


@super_admin_bp.route("/billing", methods=["GET"])
def billing_overview():
    data = {
        "plans": [
            {"key": "starter", "name": "Starter", "price": 49, "tenants": 9},
            {"key": "growth", "name": "Growth", "price": 149, "tenants": 12},
            {"key": "enterprise", "name": "Enterprise", "price": 399, "tenants": 7},
        ],
        "invoices": [
            {
                "id": "INV-2025-1102",
                "tenant": "Signal Studio",
                "amount": 399,
                "currency": "USD",
                "status": "overdue",
                "issued_at": (_now() - timedelta(days=21)).date().isoformat(),
                "due_at": (_now() - timedelta(days=7)).date().isoformat(),
            },
            {
                "id": "INV-2025-1107",
                "tenant": "Acme Retail",
                "amount": 149,
                "currency": "USD",
                "status": "paid",
                "issued_at": (_now() - timedelta(days=5)).date().isoformat(),
                "due_at": (_now() + timedelta(days=25)).date().isoformat(),
            },
        ],
    }
    return jsonify(data), 200


@super_admin_bp.route("/feature-flags", methods=["GET"])
def feature_flag_matrix():
    flags = {
        "seo_autopilot": {"label": "SEO Autopilot", "tenants_enabled": ["tn-001", "tn-002"]},
        "marketing_research": {"label": "Market Research AI", "tenants_enabled": ["tn-001"]},
        "prospect_radar": {"label": "Prospect Radar", "tenants_enabled": ["tn-002", "tn-003"]},
        "campaign_management": {"label": "Campaign Management", "tenants_enabled": []},
    }
    return jsonify({"flags": flags}), 200


@super_admin_bp.route("/audit-logs", methods=["GET"])
def audit_logs():
    logs = [
        {
            "timestamp": (_now() - timedelta(minutes=12)).isoformat() + "Z",
            "actor": "abhijeet@nexylomedia.com",
            "tenant": "tn-001",
            "action": "feature_flag.enable",
            "metadata": {"flag": "marketing_research"},
        },
        {
            "timestamp": (_now() - timedelta(hours=3)).isoformat() + "Z",
            "actor": "support@platform.io",
            "tenant": "tn-003",
            "action": "tenant.impersonate",
            "metadata": {"reason": "Investigate automation failure"},
        },
    ]
    return jsonify({"logs": logs}), 200


@super_admin_bp.route("/system-health", methods=["GET"])
def system_health():
    data = {
        "services": [
            {"name": "Flask API", "status": "operational", "response_time_ms": 142},
            {"name": "n8n Workflow Engine", "status": "operational", "active_jobs": 5},
            {"name": "SQL Database", "status": "operational", "status_detail": "All replicas healthy"},
            {"name": "Notification Worker", "status": "degraded", "status_detail": "Retry queue building up"},
        ],
        "incidents": [
            {
                "id": "INC-5562",
                "severity": "medium",
                "title": "Notification worker backlog",
                "opened_at": (_now() - timedelta(hours=4)).isoformat() + "Z",
            }
        ],
    }
    return jsonify(data), 200


