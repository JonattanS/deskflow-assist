import pandas as pd
from docx import Document
import os
from datetime import datetime

# Rutas
EXCEL_PATH = "clientes.xlsx"  
TEMPLATE_PATH1 = "PROPUESTA FE Y NE RENOVACION 202X -CLIENTE1.docx"
TEMPLATE_PATH2 = "PROPUESTA FE RENOVACION 202X -CLIENTE2.docx"
OUTPUT_DIR = "cartas_generadas"

# Crear carpeta de salida si no existe
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Cargar Excel
df = pd.read_excel(EXCEL_PATH)

# Función para reemplazar etiquetas en párrafos y tablas
def reemplazar_etiquetas(doc, datos):
    fecha_actual = datetime.now()
    meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
             'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    
    datos_fecha = {
        'día': str(fecha_actual.day),
        'Mes': meses[fecha_actual.month - 1],
        'AÑO': str(fecha_actual.year),  # AÑO en mayúscula porque en la plantilla lo está así
        'MES': meses[fecha_actual.month - 1].upper(),  # para el <MES> del pie de página si se escribe en mayúscula
        'año': str(fecha_actual.year),
        'mes': meses[fecha_actual.month - 1]
    }

    if 'Nombres y Apellidos' in datos:
        datos['Nombre'] = str(datos['Nombres y Apellidos']).split()[0]
    
    todos_datos = {**datos_fecha, **datos}

    def reemplazar_en_parrafos(parrafos):
        for p in parrafos:
            for key, value in todos_datos.items():
                etiqueta1 = f"<{key}>"
                etiqueta2 = f"« {key}»"
                if etiqueta1 in p.text or etiqueta2 in p.text:
                    for run in p.runs:
                        run.text = run.text.replace(etiqueta1, str(value))
                        run.text = run.text.replace(etiqueta2, str(value))

    def reemplazar_en_tablas(tablas):
        for table in tablas:
            for row in table.rows:
                for cell in row.cells:
                    reemplazar_en_parrafos(cell.paragraphs)

    reemplazar_en_parrafos(doc.paragraphs)
    reemplazar_en_tablas(doc.tables)

    # 🆕 Encabezado y pie de página
    for section in doc.sections:
        reemplazar_en_parrafos(section.footer.paragraphs)
        reemplazar_en_parrafos(section.header.paragraphs)


# Generar documentos
for idx, row in df.iterrows():
    nit = str(row.iloc[0])
    indicador = row.get('Indicador Tarifa', '')

    # Elegir plantilla según el valor numérico del indicador
    if pd.isna(indicador):
        print(f" Indicador vacío para NIT {nit}. Se usará plantilla 1 por defecto.")
        plantilla = TEMPLATE_PATH1
    elif str(indicador).strip() == "1":
        plantilla = TEMPLATE_PATH1
    elif str(indicador).strip() == "2":
        plantilla = TEMPLATE_PATH2
    else:
        print(f" Indicador no reconocido ('{indicador}') para NIT {nit}. Se usará plantilla 1 por defecto.")
        plantilla = TEMPLATE_PATH1

    # Cargar plantilla seleccionada
    doc = Document(plantilla)

    # Crear carpeta para cliente
    cliente_dir = os.path.join(OUTPUT_DIR, nit)
    os.makedirs(cliente_dir, exist_ok=True)

    # Reemplazar etiquetas
    reemplazar_etiquetas(doc, row.to_dict())

    # Guardar documento
    nombre_archivo = os.path.join(cliente_dir, f"Renovacion_{datetime.now().year}_{nit}.docx")
    doc.save(nombre_archivo)
    print(f" Documento generado: {nombre_archivo}")
