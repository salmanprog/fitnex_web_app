const api = {
    login: {
      url: 'admin/login',
      method: "POST",
    },
    logout: {
      url: 'admin/logout',
      method: "POST",
    },
    get_dashboard: {
      url: 'admin/dashboard',
      method: "GET",
    },
    create_users: {
      url: 'admin/users',
      method: "POST",
    },
    get_users: {
      url: 'admin/users',
      method: "GET",
    },
    get_users_hierarchy: {
      url: 'admin/user-hierarchy',
      method: "GET",
    },
    update_users: {
      url: 'admin/users',
      method: "PUT",
    },
    delete_users: {
      url: 'admin/users',
      method: "DELETE",
    },
    get_users_profiles: {
      url: 'admin/user_profiles',
      method: "GET",
    },
    change_password: {
      url: 'admin/user/change-password',
      method: "POST",
    },
    update_users: {
      url: 'admin/user',
      method: "PUT",
    },
    get_application_settings: {
      url: 'admin/application/setting',
      method: "GET",
    },
    post_application_settings: {
      url: 'admin/application/setting',
      method: "POST",
    },
    get_application_content: {
      url: 'admin/application-content',
      method: "GET",
    },
    add_application_content: {
      url: 'admin/application-content',
      method: "POST",
    },
    update_application_content: {
      url: 'admin/application-content',
      method: "PUT",
    },
    delete_application_content: {
      url: 'admin/application-content',
      method: "DELETE",
    },
    get_cms_user: {
      url: 'admin/cms-user',
      method: "GET",
    },
    get_cms_user_by_slug: {
      url: 'admin/cms-user',
      method: "GET",
    },
    update_cms_user: {
      url: 'admin/cms-user',
      method: "PUT",
    },
    create_job: {
      url: 'admin/job',
      method: "POST",
    },
    get_job: {
      url: 'admin/job',
      method: "GET",
    },
    get_crew_job: {
      url: 'admin/assign/job',
      method: "GET",
    },
    get_crew_job_by_slug: {
      url: 'admin/assign/viewjob',
      method: "GET",
    },
    update_job: {
      url: 'admin/job',
      method: "PUT",
    },
    delete_job: {
      url: 'admin/job',
      method: "DELETE",
    },
    get_status_job: {
      url: 'admin/status/job',
      method: "GET",
    },
    create_service: {
      url: 'admin/services',
      method: "POST",
    },
    get_service: {
      url: 'admin/services',
      method: "GET",
    },
    update_service: {
      url: 'admin/services',
      method: "PUT",
    },
    delete_service: {
      url: 'admin/services',
      method: "DELETE",
    },
    create_product_category: {
      url: 'admin/product_category',
      method: "POST",
    },
    get_product_category: {
      url: 'admin/product_category',
      method: "GET",
    },
    update_product_category: {
      url: 'admin/product_category',
      method: "PUT",
    },
    delete_product_category: {
      url: 'admin/product_category',
      method: "DELETE",
    },
    create_product: {
      url: 'admin/product',
      method: "POST",
    },
    get_product: {
      url: 'admin/product',
      method: "GET",
    },
    update_product: {
      url: 'admin/product',
      method: "PUT",
    },
    delete_product: {
      url: 'admin/product',
      method: "DELETE",
    },
    add_to_cart_product: {
      url: 'admin/orderproduct',
      method: "POST",
    },
    get_cart: {
      url: 'admin/orderproduct',
      method: "GET",
    },
    update_cart: {
      url: 'admin/orderproduct',
      method: "PUT",
    },
    delete_cart_product: {
      url: 'admin/orderproduct',
      method: "DELETE",
    },
    get_orders: {
      url: 'admin/order',
      method: "GET",
    },
    update_order: {
      url: 'admin/order',
      method: "PUT",
    },
    get_dashboard: {
      url: 'admin/dashboard',
      method: "GET",
    },
    create_feedback_question: {
      url: 'admin/feedback_question',
      method: "POST",
    },
    get_feedback_question: {
      url: 'admin/feedback_question',
      method: "GET",
    },
    update_feedback_question: {
      url: 'admin/feedback_question',
      method: "PUT",
    },
    delete_feedback_question: {
      url: 'admin/feedback_question',
      method: "DELETE",
    },
    create_user_feedback: {
      url: 'admin/user_feedbacks',
      method: "POST",
    },
    get_user_feedback: {
      url: 'admin/user_feedbacks',
      method: "GET",
    },
    update_user_feedback: {
      url: 'admin/user_feedbacks',
      method: "PUT",
    },
    delete_user_feedback: {
      url: 'admin/user_feedbacks',
      method: "DELETE",
    },
    create_invite_crew: {
      url: 'admin/generate/link',
      method: "POST",
    },
    get_invite_crew: {
      url: 'admin/crew/link/list',
      method: "GET",
    },
    get_invite_crew_by_token: {
      url: 'admin/crew_get_link',
      method: "GET",
    },
    update_invite_crew: {
      url: 'admin/crew_create_link',
      method: "PUT",
    },
    create_building_type: {
      url: 'admin/building_types',
      method: "POST",
    },
    get_building_type: {
      url: 'admin/building_types',
      method: "GET",
    },
    update_building_type: {
      url: 'admin/building_types',
      method: "PUT",
    },
    delete_building_type: {
      url: 'admin/building_types',
      method: "DELETE",
    },
  };
  
  
  export default api;