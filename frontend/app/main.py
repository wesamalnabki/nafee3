# frontend/app/main.py
import os
import gradio as gr
import requests

API_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")

# --- API functions ---

def get_profile(profile_id):
    r = requests.get(f"{API_URL}/get_profile", params={"profile_id": profile_id})
    return r.json()

def search_profiles(query, search_city, search_area, sim_threshold, top_k):
    data = {
        "query": query,
        "search_city": search_city or None,
        "search_area": search_area or None,
        "sim_threshold": sim_threshold,
        "top_k": top_k,
    }
    r = requests.post(f"{API_URL}/search_profiles", json=data)
    return r.json()

def add_profile(full_name, phone_number, service_city, service_description, date_of_birth=None):
    data = {
        "full_name": full_name,
        "phone_number": phone_number,
        "service_city": service_city,
        "service_description": service_description,
        "date_of_birth": date_of_birth,
    }
    r = requests.post(f"{API_URL}/add_profile", json=data)
    return r.json()

def update_profile(profile_id, full_name, phone_number, service_city, service_description, date_of_birth=None):
    data = {
        "profile_id": profile_id,
        "full_name": full_name,
        "phone_number": phone_number,
        "service_city": service_city,
        "service_description": service_description,
        "date_of_birth": date_of_birth,
    }
    r = requests.post(f"{API_URL}/update_profile", json=data)
    return r.json()

def delete_profile(profile_id):
    r = requests.delete(f"{API_URL}/delete_profile", params={"profile_id": profile_id})
    return r.json()

def add_fake_profiles():
    r = requests.post(f"{API_URL}/add_fake_profiles")
    return r.json()

# --- Build Gradio UI ---
with gr.Blocks(title="Profile Search & Management") as demo:
    gr.Markdown("## 👤 Profile Management Dashboard")

    with gr.Tab("Search Profiles"):
        gr.Markdown("### 🔍 Search profiles by service description")
        query = gr.Textbox(label="Query (Service Description)")
        city = gr.Textbox(label="City", placeholder="Optional")
        area = gr.Textbox(label="Area", placeholder="Optional")
        sim_threshold = gr.Slider(0, 1, value=0.1, step=0.05, label="Similarity Threshold")
        top_k = gr.Slider(1, 100, value=50, step=1, label="Top K Results")
        search_btn = gr.Button("Search")
        search_output = gr.JSON(label="Results")
        search_btn.click(search_profiles, inputs=[query, city, area, sim_threshold, top_k], outputs=search_output)

    with gr.Tab("Get Profile"):
        pid = gr.Textbox(label="Profile ID")
        get_btn = gr.Button("Get Profile")
        get_output = gr.JSON(label="Profile Data")
        get_btn.click(get_profile, inputs=pid, outputs=get_output)

    with gr.Tab("Add Profile"):
        full_name = gr.Textbox(label="Full Name")
        phone = gr.Textbox(label="Phone Number")
        city = gr.Textbox(label="Service City")
        desc = gr.Textbox(label="Service Description")
        dob = gr.Textbox(label="Date of Birth (YYYY-MM-DD)", placeholder="Optional")
        add_btn = gr.Button("Add Profile")
        add_output = gr.JSON(label="Response")
        add_btn.click(add_profile, inputs=[full_name, phone, city, desc, dob], outputs=add_output)

    with gr.Tab("Update Profile"):
        pid_upd = gr.Textbox(label="Profile ID")
        full_name_upd = gr.Textbox(label="Full Name")
        phone_upd = gr.Textbox(label="Phone Number")
        city_upd = gr.Textbox(label="Service City")
        desc_upd = gr.Textbox(label="Service Description")
        dob_upd = gr.Textbox(label="Date of Birth (YYYY-MM-DD)", placeholder="Optional")
        upd_btn = gr.Button("Update Profile")
        upd_output = gr.JSON(label="Response")
        upd_btn.click(update_profile, inputs=[pid_upd, full_name_upd, phone_upd, city_upd, desc_upd, dob_upd], outputs=upd_output)

    with gr.Tab("Delete Profile"):
        pid_del = gr.Textbox(label="Profile ID")
        del_btn = gr.Button("Delete Profile")
        del_output = gr.JSON(label="Response")
        del_btn.click(delete_profile, inputs=pid_del, outputs=del_output)

    # with gr.Tab("Add Fake Profiles"):
    #     fake_btn = gr.Button("Add Fake Profiles")
    #     fake_output = gr.JSON(label="Response")
    #     fake_btn.click(add_fake_profiles, outputs=fake_output)

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=8501, share=True)
