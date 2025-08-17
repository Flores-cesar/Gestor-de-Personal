from django.urls import path
from . import views

urlpatterns = [
    # ----- EMPLEADO -----
    path("empleados/list/", views.empleado_list, name="empleado_list"),
    path("empleados/create/", views.empleado_create, name="empleado_create"),
    path("empleados/<int:id_empleado>/", views.empleado_detail, name="empleado_detail"),
    path("empleados/<int:id_empleado>/update/", views.empleado_update, name="empleado_update"),
    path("empleados/<int:id_empleado>/delete/", views.empleado_delete, name="empleado_delete"),

    # ----- DEPARTAMENTO -----
    path("departamentos/list/", views.departamento_list, name="departamento_list"),
    path("departamentos/create/", views.departamento_create, name="departamento_create"),
    path("departamentos/<int:id_departamento>/", views.departamento_detail, name="departamento_detail"),
    path("departamentos/<int:id_departamento>/update/", views.departamento_update, name="departamento_update"),
    path("departamentos/<int:id_departamento>/delete/", views.departamento_delete, name="departamento_delete"),

    # ----- ROL -----
    path("roles/list/", views.rol_list, name="rol_list"),
    path("roles/create/", views.rol_create, name="rol_create"),
    path("roles/<int:id_rol>/", views.rol_detail, name="rol_detail"),
    path("roles/<int:id_rol>/update/", views.rol_update, name="rol_update"),
    path("roles/<int:id_rol>/delete/", views.rol_delete, name="rol_delete"),
]
