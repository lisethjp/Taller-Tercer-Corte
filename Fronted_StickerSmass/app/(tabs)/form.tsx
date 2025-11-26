import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../hooks/useApiFetch";

type DetalleItem = {
  id_detalle: number;
  producto: string;
  referencia: string;
  valor_unit: number;
  caregoria: string | null;
  proveedor: string;
  correo: string;
  telefono: number | null;
};

export default function FormScreen() {
  // PRODUCTO
  const [nombreProducto, setNombreProducto] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");
  const [categoria, setCategoria] = useState("");
  const [referencia, setReferencia] = useState("");

  // PROVEEDOR
  const [nombreProveedor, setNombreProveedor] = useState("");
  const [direccionProveedor, setDireccionProveedor] = useState("");
  const [correoProveedor, setCorreoProveedor] = useState("");
  const [telefonoProveedor, setTelefonoProveedor] = useState("");

  // BUSQUEDA
  const [textoBusqueda, setTextoBusqueda] = useState("");

  // ESTADOS
  const [loading, setLoading] = useState(false);
  const [consultando, setConsultando] = useState(false);
  const [detalles, setDetalles] = useState<DetalleItem[]>([]);

  const limpiarFormulario = () => {
    setNombreProducto("");
    setValorUnitario("");
    setCategoria("");
    setReferencia("");
    setNombreProveedor("");
    setDireccionProveedor("");
    setCorreoProveedor("");
    setTelefonoProveedor("");
  };

  // GUARDAR
  const handleGuardar = async () => {
    if (!nombreProducto.trim() || !referencia.trim()) {
      Alert.alert("Validación", "Nombre del producto y referencia son obligatorios.");
      return;
    }

    if (!nombreProveedor.trim() || !direccionProveedor.trim() || !correoProveedor.trim()) {
      Alert.alert("Validación", "Nombre, dirección y correo del proveedor son obligatorios.");
      return;
    }

    const valorNum = valorUnitario ? Number(valorUnitario) : 0;
    if (isNaN(valorNum)) {
      Alert.alert("Validación", "El valor unitario debe ser un número.");
      return;
    }

    setLoading(true);

    try {
      const body = {
        producto: {
          nombre: nombreProducto,
          valor_unit: valorNum,
          caregoria: categoria || null,
          referencia,
        },
        proveedor: {
          nombre: nombreProveedor,
          direcion: direccionProveedor,
          correo: correoProveedor,
          telefono: telefonoProveedor || null,
        },
      };

      const rta = await api.post("/detalle-producto", body);

      Alert.alert("Éxito", rta.message ?? "Registro guardado correctamente");

      limpiarFormulario();
      await handleConsultar(); // recargar lista
    } catch (error: any) {
      console.error("❌ Error guardando:", error);
      Alert.alert("Error", error?.message ?? "Error al guardar el registro.");
    } finally {
      setLoading(false);
    }
  };

  // CONSULTAR (con filtro por textoBusqueda)
  const handleConsultar = async () => {
    console.log("🔍 Consultar...");
    setConsultando(true);

    try {
      let path = "/detalle-producto";
      const texto = textoBusqueda.trim();

      if (texto !== "") {
        // agregamos ?busqueda=...
        const encoded = encodeURIComponent(texto);
        path = `/detalle-producto?busqueda=${encoded}`;
      }

      const data = await api.get<DetalleItem[]>(path);
      console.log("📡 Datos recibidos:", data);
      setDetalles(data);
    } catch (error: any) {
      console.error("❌ Error consultando:", error);
      Alert.alert("Error", "No se pudo consultar la información.");
    } finally {
      setConsultando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#25292e" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>Detalle de Producto</Text>

        {/* PRODUCTO */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Producto</Text>

          <Text style={styles.label}>Nombre del producto</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Fertilizante X"
            placeholderTextColor="#aaa"
            value={nombreProducto}
            onChangeText={setNombreProducto}
          />

          <Text style={styles.label}>Valor unitario</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 25000"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={valorUnitario}
            onChangeText={setValorUnitario}
          />

          <Text style={styles.label}>Categoría</Text>
          <TextInput
            style={styles.input}
            placeholder="Insumo, Herramienta..."
            placeholderTextColor="#aaa"
            value={categoria}
            onChangeText={setCategoria}
          />

          <Text style={styles.label}>Referencia</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: REF-001"
            placeholderTextColor="#aaa"
            value={referencia}
            onChangeText={setReferencia}
          />
        </View>

        {/* PROVEEDOR */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Proveedor</Text>

          <Text style={styles.label}>Nombre del proveedor</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Agroinsumos S.A."
            placeholderTextColor="#aaa"
            value={nombreProveedor}
            onChangeText={setNombreProveedor}
          />

          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            placeholder="Dirección del proveedor"
            placeholderTextColor="#aaa"
            value={direccionProveedor}
            onChangeText={setDireccionProveedor}
          />

          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            keyboardType="email-address"
            value={correoProveedor}
            onChangeText={setCorreoProveedor}
          />

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 3200000000"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            value={telefonoProveedor}
            onChangeText={setTelefonoProveedor}
          />
        </View>

        {/* BUSCADOR */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Buscar registros</Text>
          <Text style={styles.label}>
            Escribe nombre de producto o referencia
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Fertilizante, REF-001..."
            placeholderTextColor="#aaa"
            value={textoBusqueda}
            onChangeText={setTextoBusqueda}
          />
        </View>

        {/* BOTONES */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleGuardar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonTextPrimary}>Guardar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handleConsultar}
            disabled={consultando}
          >
            {consultando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonTextSecondary}>Consultar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* LISTA */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Registros</Text>

          {detalles.length === 0 ? (
            <Text style={styles.emptyText}>
              No hay registros. Guarda o escribe algo y consulta.
            </Text>
          ) : (
            detalles.map((item) => (
              <View key={item.id_detalle} style={styles.listItem}>
                <Text style={styles.itemTitle}>
                  {item.producto} ({item.referencia})
                </Text>
                <Text style={styles.itemText}>
                  Valor: ${item.valor_unit} / Categoría: {item.caregoria ?? "N/A"}
                </Text>
                <Text style={styles.itemText}>
                  Proveedor: {item.proveedor} - {item.correo}
                </Text>
                <Text style={styles.itemText}>
                  Teléfono: {item.telefono ?? "N/A"}
                </Text>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#25292e",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffd33d",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#2f3137",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#3a3f4b",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 12,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#ffd33d",
  },
  buttonSecondary: {
    backgroundColor: "#444b5a",
  },
  buttonTextPrimary: {
    color: "#000",
    fontWeight: "700",
  },
  buttonTextSecondary: {
    color: "#fff",
    fontWeight: "700",
  },
  listContainer: {
    backgroundColor: "#2f3137",
    padding: 14,
    borderRadius: 12,
  },
  emptyText: {
    color: "#ccc",
    fontSize: 14,
  },
  listItem: {
    paddingVertical: 8,
    borderBottomColor: "#555",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  itemTitle: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 4,
  },
  itemText: {
    color: "#ddd",
    fontSize: 13,
  },
});
