import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Empleado, Rol, Departamento

def _parse_json(request):
    try:
        body = request.body.decode("utf-8") if request.body else "{}"
        return json.loads(body)
    except json.JSONDecodeError:
        return None

# --------------------------
# CRUD DE EMPLEADO
# --------------------------
@csrf_exempt
@require_http_methods(["GET"])
def empleado_list(request):
    empleados = list(Empleado.objects.values())
    return JsonResponse({"message": "success", "empleados": empleados})

@csrf_exempt
@require_http_methods(["GET"])
def empleado_detail(request, id_empleado):
    try:
        e = Empleado.objects.get(id_empleado=id_empleado)
    except Empleado.DoesNotExist:
        return JsonResponse({"message": "Empleado no encontrado"}, status=404)

    data = {
        "id_empleado": e.id_empleado,
        "nombre": e.nombre,
        "apellido": e.apellido,
        "edad": e.edad,
        "rol": e.rol.id_rol,
        "fecha_ingreso": e.fecha_ingreso,
        "salario": e.salario,
        "estado": e.estado,
    }
    return JsonResponse({"message": "success", "empleado": data})

@csrf_exempt
@require_http_methods(["POST"])
def empleado_create(request):
    data = _parse_json(request)
    if data is None:
        return JsonResponse({"message": "JSON inválido"}, status=400)

    required = ["nombre", "apellido", "rol", "fecha_ingreso", "salario","edad"]
    missing = [k for k in required if k not in data]
    if missing:
        return JsonResponse({"message": f"Faltan campos: {', '.join(missing)}"}, status=400)

    try:
        rol = Rol.objects.get(id_rol=data["rol"])
    except Rol.DoesNotExist:
        return JsonResponse({"message": "El rol especificado no existe"}, status=400)

    e = Empleado.objects.create(
        nombre=data["nombre"],
        apellido=data["apellido"],
        edad=data.get("edad", 18),
        rol=rol,
        fecha_ingreso=data["fecha_ingreso"],  # formato ISO: YYYY-MM-DD
        salario=data["salario"],
        estado=data.get("estado", "activo"),
    )
    return JsonResponse({"message": "Empleado creado", "id_empleado": e.id_empleado}, status=201)

@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
def empleado_update(request, id_empleado):
    data = _parse_json(request)
    if data is None:
        return JsonResponse({"message": "JSON inválido"}, status=400)

    try:
        e = Empleado.objects.get(id_empleado=id_empleado)
    except Empleado.DoesNotExist:
        return JsonResponse({"message": "Empleado no encontrado"}, status=404)

    # Actualizaciones parciales (PATCH) o totales (PUT)
    e.nombre = data.get("nombre", e.nombre)
    e.apellido = data.get("apellido", e.apellido)
    e.edad = data.get("edad", e.edad)
    e.salario = data.get("salario", e.salario)

    if "rol" in data:
        try:
            e.rol = Rol.objects.get(id_rol=data["rol"])
        except Rol.DoesNotExist:
            return JsonResponse({"message": "El rol especificado no existe"}, status=400)

    e.fecha_ingreso = data.get("fecha_ingreso", e.fecha_ingreso)
    
    if "estado" in data:
        e.estado = data["estado"]

    e.save()
    return JsonResponse({"message": "Empleado actualizado"})

@csrf_exempt
@require_http_methods(["DELETE"])
def empleado_delete(request, id_empleado):
    try:
        e = Empleado.objects.get(id_empleado=id_empleado)
    except Empleado.DoesNotExist:
        return JsonResponse({"message": "Empleado no encontrado"}, status=404)

    e.delete()
    return JsonResponse({"message": "Empleado eliminado"})

# --------------------------
# CRUD DEPARTAMENTO
# --------------------------
@csrf_exempt
@require_http_methods(["GET"])
def departamento_list(request):
    departamentos = list(Departamento.objects.values())
    return JsonResponse({"message": "success", "departamentos": departamentos})

@csrf_exempt
@require_http_methods(["GET"])
def departamento_detail(request, id_departamento):
    try:
        d = Departamento.objects.get(id_departamento=id_departamento)
    except Departamento.DoesNotExist:
        return JsonResponse({"message": "Departamento no encontrado"}, status=404)

    data = {
        "id_departamento": d.id_departamento,
        "responsable": d.responsable.id_empleado if d.responsable else None,
        "nombre": d.nombre,
        "descripcion": d.descripcion,
        "parent": d.parent.id_departamento if d.parent else None,
    }
    return JsonResponse({"message": "success", "departamento": data})

@csrf_exempt
@require_http_methods(["POST"])
def departamento_create(request):
    data = _parse_json(request)
    if data is None:
        return JsonResponse({"message": "JSON inválido"}, status=400)

    responsable_id = None
    if data.get("responsable"):
        try:
            responsable_id = Empleado.objects.get(id_empleado=data["responsable"])
        except Empleado.DoesNotExist:
            return JsonResponse({"message": "Responsable no encontrado"}, status=400)

    parent_id = None
    if data.get("parent"):
        try:
            parent_id = Departamento.objects.get(id_departamento=data["parent"])
        except Departamento.DoesNotExist:
            return JsonResponse({"message": "Departamento padre no encontrado"}, status=400)

    d = Departamento.objects.create(
        responsable=responsable_id,
        parent=parent_id, 
        nombre=data.get("nombre", ""),
        descripcion=data.get("descripcion", "")
    )
    return JsonResponse({"message": "Departamento creado", "id_departamento": d.id_departamento}, status=201)

@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
def departamento_update(request, id_departamento):
    data = _parse_json(request)
    if data is None:
        return JsonResponse({"message": "JSON inválido"}, status=400)

    try:
        d = Departamento.objects.get(id_departamento=id_departamento)
    except Departamento.DoesNotExist:
        return JsonResponse({"message": "Departamento no encontrado"}, status=404)

    d.nombre = data.get("nombre", d.nombre)
    d.descripcion = data.get("descripcion", d.descripcion)

    if "responsable" in data:
        if data["responsable"] is None:
            d.responsable = None
        else:
            try:
                d.responsable = Empleado.objects.get(id_empleado=data["responsable"])
            except Empleado.DoesNotExist:
                return JsonResponse({"message": "Responsable no encontrado"}, status=400)

    if "parent" in data: 

        if data["parent"] == id_departamento:
            return JsonResponse(
                {"message": "Un departamento no puede ser su propio padre"},
                status=400
            )
        
        if data["parent"] is None:
            d.parent = None
        else:
            try:
                d.parent = Departamento.objects.get(id_departamento=data["parent"])
            except Departamento.DoesNotExist:
                return JsonResponse({"message": "Departamento padre no encontrado"}, status=400)

    d.save()
    return JsonResponse({"message": "Departamento actualizado"})

@csrf_exempt
@require_http_methods(["DELETE"])
def departamento_delete(request, id_departamento):
    try:
        d = Departamento.objects.get(id_departamento=id_departamento)
    except Departamento.DoesNotExist:
        return JsonResponse({"message": "Departamento no encontrado"}, status=404)

    d.delete()
    return JsonResponse({"message": "Departamento eliminado"})

# --------------------------
# CRUD ROL
# --------------------------
@csrf_exempt
@require_http_methods(["GET"])
def rol_list(request):
    roles = list(Rol.objects.values())
    return JsonResponse({"message": "success", "roles": roles})

@csrf_exempt
@require_http_methods(["GET"])
def rol_detail(request, id_rol):
    try:
        r = Rol.objects.get(id_rol=id_rol)
    except Rol.DoesNotExist:
        return JsonResponse({"message": "Rol no encontrado"}, status=404)

    data = {
        "id_rol": r.id_rol,
        "departamento": r.departamento.id_departamento,
        "nombre": r.nombre,
        "responsabilidades": r.responsabilidades,
    }
    return JsonResponse({"message": "success", "rol": data})

@csrf_exempt
@require_http_methods(["POST"])
def rol_create(request):
    data = _parse_json(request)
    if data is None:
        return JsonResponse({"message": "JSON inválido"}, status=400)

    try:
        depto_id = Departamento.objects.get(id_departamento=data["departamento"])
    except Departamento.DoesNotExist:
        return JsonResponse({"message": "Departamento no encontrado"}, status=400)

    r = Rol.objects.create(
        departamento=depto_id,
        nombre=data.get("nombre", ""),
        responsabilidades=data.get("responsabilidades", "")
    )
    return JsonResponse({"message": "Rol creado", "id_rol": r.id_rol}, status=201)

@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
def rol_update(request, id_rol):
    data = _parse_json(request)
    if data is None:
        return JsonResponse({"message": "JSON inválido"}, status=400)

    try:
        r = Rol.objects.get(id_rol=id_rol)
    except Rol.DoesNotExist:
        return JsonResponse({"message": "Rol no encontrado"}, status=404)

    r.nombre = data.get("nombre", r.nombre)
    r.responsabilidades = data.get("responsabilidades", r.responsabilidades)

    if "departamento" in data:
        try:
            r.departamento = Departamento.objects.get(id_departamento=data["departamento"])
        except Departamento.DoesNotExist:
            return JsonResponse({"message": "Departamento no encontrado"}, status=400)

    r.save()
    return JsonResponse({"message": "Rol actualizado"})

@csrf_exempt
@require_http_methods(["DELETE"])
def rol_delete(request, id_rol):
    try:
        r = Rol.objects.get(id_rol=id_rol)
    except Rol.DoesNotExist:
        return JsonResponse({"message": "Rol no encontrado"}, status=404)

    r.delete()
    return JsonResponse({"message": "Rol eliminado"})