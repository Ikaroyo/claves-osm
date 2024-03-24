window.addEventListener("load", () => {
  const closebutton = document.getElementById("close-button");
  const clipboard = document.getElementById("clipboard");
  const printer = document.getElementById("printer");
  const cardbackground = document.getElementById("card-background");
  const cardcontent = document.getElementById("card-content");

  printer.addEventListener("click", function () {
    window.print();
  });
  /* hide close and clipboard button on print */
  window.onbeforeprint = function () {
    closebutton.style.display = "none";
    clipboard.style.display = "none";
    printer.style.display = "none";
  };

  /* after print show close and clipboard button */
  window.onafterprint = function () {
    closebutton.style.display = "block";
    clipboard.style.display = "block";
    printer.style.display = "block";
  };

  cardbackground.addEventListener("click", function (event) {
    if (event.target !== cardcontent) {
      document.querySelector(".card-background").style.display = "none";
    }
  });

  closebutton.addEventListener("click", function (event) {
    document.querySelector(".card-background").style.display = "none";
  });

  clipboard.addEventListener("click", function (event) {
    navigator.clipboard.writeText(
      "Obras Sanitarias Mercedes\n" +
        "Cuenta: " +
        cuenta.textContent +
        "\n" +
        "Titular: " +
        usuario.textContent +
        "\n" +
        "Dirección: " +
        direccion.textContent +
        "\n" +
        "Clave Pago Electrónico: " +
        clave.textContent +
        "\n" +
        Tipo.textContent
    );
    const toast = document.getElementById("toast");
    toast.style.display = "block";
    toast.innerHTML = "<p>Informacion copiada al portapapeles</p>";
    toast.innerHTML += "<p>Presiona Ctrl+V para pegar la informacion</p>";
    setTimeout(function () {
      toast.style.display = "none";
    }, 3000);
  });
  function loadCards(sender) {
    const cardContent = document.getElementById("card-content");
    const cardBackground = document.getElementById("card-background");
    cardBackground.style.display = "flex";

    // this function will be called when tr is clicked to get sender data which is from row of table
    const td = sender.querySelectorAll("td");

    // fill card content with data
    /*
          <h2>Cuenta</h2>
      <p id="cuenta">0006448/000</p>
      <h2>Usuario</h2>
      <p id="usuario">PEREZ MARTIN</p>
      <h2>Dirección</h2>
      <p id="direccion">3 DE FEBRERO 215</p>
      <h2>Clave</h2>
      <p id="clave">100000006854</p>
      <h2>Tipo Servicio</h2>
      <p id="Tipo">Servicios Sanitarios</p>
      */

    const cuenta = document.getElementById("cuenta");
    const usuario = document.getElementById("usuario");
    const direccion = document.getElementById("direccion");
    const clave = document.getElementById("clave");
    const Tipo = document.getElementById("Tipo");

    cuenta.textContent = td[0].textContent;
    usuario.textContent = td[1].textContent;
    direccion.textContent = td[2].textContent;
    clave.textContent = td[4].textContent;
    Tipo.textContent = td[7].textContent;
  }

  document.getElementById("loader").style.display = "block";

  var request = new XMLHttpRequest();
  request.open("GET", "./claves.json");
  request.send();
  request.onload = function () {
    if (request.status == 200) {
      var data = JSON.parse(request.responseText);
    } else {
      const toast = document.getElementById("toast");
      toast.style.display = "block";
      toast.innerHTML = "Error al cargar el archivo JSON";
      setTimeout(function () {
        toast.style.display = "none";
      }, 3000);
    }
    if (data) {
      for (const item of data.data) {
        const tr = document.createElement("tr");
        // add Class hidden
        tr.classList.add("hidden");
        // add onclick event to show card
        tr.onclick = function () {
          loadCards(this);
        };
        const tdCuenta = document.createElement("td");
        tdCuenta.textContent = item[0];
        const tdUsuario = document.createElement("td");
        if (item[4] === "") {
          tr.classList.add("red");
        }
        tdUsuario.textContent = item[1];
        const tdDireccion = document.createElement("td");
        tdDireccion.textContent = item[2];
        const tdRecibo = document.createElement("td");
        tdRecibo.textContent = item[3];
        const tdClave = document.createElement("td");
        tdClave.textContent = item[4];
        const tdArchivo = document.createElement("td");
        tdArchivo.textContent = item[5];
        const tdPagina = document.createElement("td");
        tdPagina.textContent = item[6];
        const tdTipo = document.createElement("td");
        tdTipo.textContent = item[7];

        tr.appendChild(tdCuenta);
        tr.appendChild(tdUsuario);
        tr.appendChild(tdDireccion);
        tr.appendChild(tdRecibo);
        tr.appendChild(tdClave);
        tr.appendChild(tdArchivo);
        tr.appendChild(tdPagina);
        tr.appendChild(tdTipo);

        const tablaEmision = document.getElementById("tablaEmision");
        tablaEmision.appendChild(tr);
      }
      document.getElementById("loader").style.display = "none";
    } else {
      console.log("error al cargar el archivo JSON");
    }
  };
});

// Controlador de eventos para el campo de búsqueda
const campoBusqueda = document.getElementById("busqueda");
campoBusqueda.addEventListener("keyup", async function (event) {
  if (event.key === "Enter") {
    const busqueda = event.target.value.toLowerCase();
    if (busqueda === "") {
      const toast = document.getElementById("toast");
      toast.style.display = "block";
      toast.innerHTML = "Ingresa un valor a buscar";
      setTimeout(function () {
        toast.style.display = "none";
      }, 3000);
    } else {
      await showLoader();

      const filas = tablaEmision.getElementsByTagName("tr");

      // Iterar sobre cada fila de la tabla y ocultar las que no coinciden con la búsqueda
      for (let i = 0; i < filas.length; i++) {
        const fila = filas[i];
        const celdaCuenta = fila.getElementsByTagName("td")[0];
        const cuenta = celdaCuenta.textContent.toLowerCase();

        if (cuenta.includes(busqueda)) {
          fila.classList.remove("hidden");
        } else {
          fila.classList.add("hidden");
        }
      }
    }
  }
  await hideLoader();
});

const botonBuscar = document.getElementById("buscar");
const tablaEmision = document.getElementById("tablaEmision"); // assuming this is the id of your table
botonBuscar.addEventListener("click", async function () {
  const busqueda = document.getElementById("busqueda").value.toLowerCase();
  if (busqueda === "") {
    const toast = document.getElementById("toast");
    toast.style.display = "block";
    toast.innerHTML = "Ingresa un valor a buscar";
    setTimeout(function () {
      toast.style.display = "none";
    }, 3000);
    return; // return early if the search input is empty
  }
  await showLoader();

  const filas = tablaEmision.getElementsByTagName("tr");

  // Iterar sobre cada fila de la tabla y ocultar las que no coinciden con la búsqueda
  for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];
    const celdaCuenta = fila.getElementsByTagName("td")[0];
    const cuenta = celdaCuenta.textContent.toLowerCase();

    if (cuenta.includes(busqueda)) {
      fila.classList.remove("hidden");
    } else {
      fila.classList.add("hidden");
    }
  }

  await hideLoader();
});

async function showLoader() {
  document.getElementById("loader").style.display = "block";
  await new Promise((resolve) => setTimeout(resolve, 1000));
  document.getElementById("loader").style.display = "none";
}

async function hideLoader() {
  document.getElementById("loader").style.display = "none";
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

/*
// Controlador de eventos para el campo de búsqueda
const campoBusqueda = document.getElementById("busqueda");
campoBusqueda.addEventListener("keyup", function (event) {
  const busqueda = event.target.value.toLowerCase();
  const filas = tablaEmision.getElementsByTagName("tr");

  // Iterar sobre cada fila de la tabla y ocultar las que no coinciden con la búsqueda
  for (let i = 0; i < filas.length; i++) {
    const fila = filas[i];
    const celdaCuenta = fila.getElementsByTagName("td")[0];
    const cuenta = celdaCuenta.textContent.toLowerCase();

    if (cuenta.includes(busqueda)) {
      fila.classList.remove("hidden");
    } else {
      fila.classList.add("hidden");
    }
  }
});
*/

/*
function cargarJSON() {
  fetch("./claves.json")
    .then((response) => response.json())
    .then((data) => {
      const tablaEmision = document.getElementById("tablaEmision");

      for (const item of data.data) {
        const tr = document.createElement("tr");
        const tdCuenta = document.createElement("td");
        tdCuenta.textContent = item[0];
        const tdUsuario = document.createElement("td");
        tdUsuario.textContent = item[1];
        const tdDireccion = document.createElement("td");
        tdDireccion.textContent = item[2];
        const tdRecibo = document.createElement("td");
        tdRecibo.textContent = item[3];
        const tdClave = document.createElement("td");
        tdClave.textContent = item[4];
        const tdArchivo = document.createElement("td");
        tdArchivo.textContent = item[5];
        const tdPagina = document.createElement("td");
        tdPagina.textContent = item[6];
        const tdTipo = document.createElement("td");
        tdTipo.textContent = item[7];

        tr.appendChild(tdCuenta);
        tr.appendChild(tdUsuario);
        tr.appendChild(tdDireccion);
        tr.appendChild(tdRecibo);
        tr.appendChild(tdClave);
        tr.appendChild(tdArchivo);
        tr.appendChild(tdPagina);
        tr.appendChild(tdTipo);
        tablaEmision.appendChild(tr);
      }
    });
}
*/
