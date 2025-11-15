# devsmart/routes/api/user/v1/aap.py
import os
import requests
from flask import request, jsonify

from . import user_bp  # import the blueprint

AAP_BASE_URL = os.getenv("AAP_BASE_URL", "http://czeski-film-aap:8080")


def aap_url(path: str) -> str:
    return f"{AAP_BASE_URL}{path}"


@user_bp.route("/aap/healthz", methods=["GET"])
def aap_health():
    try:
        r = requests.get(aap_url("/healthz"), timeout=5)
        return jsonify(r.json()), r.status_code
    except Exception as e:
        return jsonify({"error": "aap_unreachable", "details": str(e)}), 502


# ORGS

@user_bp.route("/aap/orgs", methods=["GET"])
def aap_list_orgs():
    r = requests.get(aap_url("/orgs"), timeout=10)
    return jsonify(r.json()), r.status_code


@user_bp.route("/aap/orgs/<int:org_id>", methods=["GET"])
def aap_get_org(org_id: int):
    r = requests.get(aap_url(f"/orgs/{org_id}"), timeout=10)
    return jsonify(r.json()), r.status_code


@user_bp.route("/aap/orgs", methods=["POST"])
def aap_create_org():
    payload = request.get_json(force=True, silent=True) or {}
    r = requests.post(aap_url("/orgs"), json=payload, timeout=10)
    return jsonify(r.json()), r.status_code


@user_bp.route("/aap/orgs/<int:org_id>", methods=["PUT", "PATCH"])
def aap_update_org(org_id: int):
    payload = request.get_json(force=True, silent=True) or {}
    r = requests.put(aap_url(f"/orgs/{org_id}"), json=payload, timeout=10)
    return jsonify(r.json()), r.status_code


@user_bp.route("/aap/orgs/<int:org_id>", methods=["DELETE"])
def aap_delete_org(org_id: int):
    r = requests.delete(aap_url(f"/orgs/{org_id}"), timeout=10)
    try:
        return (jsonify(r.json()), r.status_code) if r.text else ("", r.status_code)
    except Exception:
        return (r.text, r.status_code) if r.text else ("", r.status_code)


# INVENTORIES

@user_bp.route("/aap/inventories", methods=["GET"])
def aap_list_inventories():
    r = requests.get(aap_url("/inventories"), timeout=10)
    return jsonify(r.json()), r.status_code


@user_bp.route("/aap/inventories/<int:inv_id>", methods=["GET"])
def aap_get_inventory(inv_id: int):
    r = requests.get(aap_url(f"/inventories/{inv_id}"), timeout=10)
    return jsonify(r.json()), r.status_code


@user_bp.route("/aap/inventories", methods=["POST"])
def aap_create_inventory():
    payload = request.get_json(force=True, silent=True) or {}
    r = requests.post(aap_url("/inventories"), json=payload, timeout=10)
    return jsonify(r.json()), r.status_code


@user_bp.route("/aap/inventories/<int:inv_id>", methods=["PUT", "PATCH"])
def aap_update_inventory(inv_id: int):
    payload = request.get_json(force=True, silent=True) or {}
    r = requests.put(aap_url(f"/inventories/{inv_id}"), json=payload, timeout=10)
    return jsonify(r.json()), r.status_code


@user_bp.route("/aap/inventories/<int:inv_id>", methods=["DELETE"])
def aap_delete_inventory(inv_id: int):
    r = requests.delete(aap_url(f"/inventories/{inv_id}"), timeout=10)
    try:
        return (jsonify(r.json()), r.status_code) if r.text else ("", r.status_code)
    except Exception:
        return (r.text, r.status_code) if r.text else ("", r.status_code)


# PLAYBOOKS

@user_bp.route("/aap/playbooks", methods=["GET"])
def aap_list_playbooks():
    r = requests.get(aap_url("/playbooks"), timeout=10)
    return jsonify(r.json()), r.status_code


@user_bp.route("/aap/playbooks/<int:pb_id>", methods=["GET"])
def aap_get_playbook(pb_id: int):
    r = requests.get(aap_url(f"/playbooks/{pb_id}"), timeout=10)
    return jsonify(r.json()), r.status_code


@user_bp.route("/aap/playbooks", methods=["POST"])
def aap_create_playbook():
    payload = request.get_json(force=True, silent=True) or {}
    r = requests.post(aap_url("/playbooks"), json=payload, timeout=10)
    return jsonify(r.json()), r.status_code


@user_bp.route("/aap/playbooks/<int:pb_id>", methods=["PUT", "PATCH"])
def aap_update_playbook(pb_id: int):
    payload = request.get_json(force=True, silent=True) or {}
    r = requests.put(aap_url(f"/playbooks/{pb_id}"), json=payload, timeout=10)
    return jsonify(r.json()), r.status_code


@user_bp.route("/aap/playbooks/<int:pb_id>", methods=["DELETE"])
def aap_delete_playbook(pb_id: int):
    r = requests.delete(aap_url(f"/playbooks/{pb_id}"), timeout=10)
    try:
        return (jsonify(r.json()), r.status_code) if r.text else ("", r.status_code)
    except Exception:
        return (r.text, r.status_code) if r.text else ("", r.status_code)


# RUN PLAYBOOK → JOB

@user_bp.route("/aap/playbooks/<int:pb_id>/run", methods=["POST"])
def aap_run_playbook(pb_id: int):
    payload = request.get_json(force=True, silent=True) or {}
    r = requests.post(aap_url(f"/playbooks/{pb_id}/run"), json=payload, timeout=20)
    return jsonify(r.json()), r.status_code


# JOBS

@user_bp.route("/aap/jobs", methods=["GET"])
def aap_list_jobs():
    r = requests.get(aap_url("/jobs"), timeout=10)
    return jsonify(r.json()), r.status_code


@user_bp.route("/aap/jobs/<int:job_id>", methods=["GET"])
def aap_get_job(job_id: int):
    r = requests.get(aap_url(f"/jobs/{job_id}"), timeout=10)
    return jsonify(r.json()), r.status_code
