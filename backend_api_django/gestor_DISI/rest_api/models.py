from django.db import models

class Departamento(models.Model):
    id_departamento = models.AutoField(primary_key=True)
    responsable = models.ForeignKey(
        "Empleado",  # entre comillas porque se referencia más abajo
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column="id_responsable"
    )
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "departamento"

    def __str__(self):
        return self.nombre


class Rol(models.Model):
    id_rol = models.AutoField(primary_key=True)
    departamento = models.ForeignKey(
        Departamento,
        on_delete=models.CASCADE,
        db_column="id_departamento"
    )
    nombre = models.CharField(max_length=50)
    responsabilidades = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "rol"

    def __str__(self):
        return self.nombre


class Empleado(models.Model):
    ESTADOS = [
        ('activo', 'Activo'),
        ('inactivo', 'Inactivo'),
        ('suspendido', 'Suspendido'),
        ('baja', 'Baja'),
    ]

    id_empleado = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    edad = models.IntegerField(default=18)
    rol = models.ForeignKey(
        Rol,
        on_delete=models.RESTRICT,
        db_column="id_rol"
    )
    fecha_ingreso = models.DateField()
    salario = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='activo'
    )

    class Meta:
        db_table = "empleado"

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
