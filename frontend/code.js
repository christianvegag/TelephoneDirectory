//Definición de variables
const url = "http://localhost:3001/api/contact/";
const container = document.querySelector("tbody");
let result = "";

const modalDirectory = new bootstrap.Modal(
  document.getElementById("modalDirectory")
);

const modalSearch = new bootstrap.Modal(document.getElementById("modalSearch"));

const btnSpace = document.getElementById("btnSpace");

const formDirectory = document.querySelector("form");
const formSearch = document.querySelector(".search");

const names = document.getElementById("name");
const phone = document.getElementById("phone");
const mobile = document.getElementById("mobile");
const nameSearch = document.getElementById("nameSearch");

let option = "";

btnRegister.addEventListener("click", () => {
  names.value = "";
  phone.value = "";
  mobile.value = "";
  modalDirectory.show();
  option = "register";
});

btnSearch.addEventListener("click", () => {
  nameSearch.value = "";
  modalSearch.show();
});

function redireccionar() {
  setTimeout("location.reload()", 1000);
}

//funcion para lISTAR los resultados
const list = (data) => {
  data.forEach((dir, i) => {
    result += `<tr class="text-center">
                            <td class="d-none">${dir._id}</td>
                            <td>${i + 1}</td>
                            <td class="text-capitalize">${dir.name}</td>
                            <td>${dir.phone}</td>
                            <td>${dir.mobile}</td>
                            <td class="text-center"><a class="btnEdit btn btn-primary">Edit</a>&nbsp;<a class="btnDelete btn btn-danger">Delete</a></td>
                       </tr>
                    `;
  });
  container.innerHTML = result;
};

//Procedimiento LISTAR
fetch(url + "list")
  .then((response) => response.json())
  .then((json) => list(json.contacts))
  .catch((error) => console.log(error));

// Funcion ON para Boton
const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

//Procedimiento ELIMINAR

on(document, "click", ".btnDelete", (e) => {
  const row = e.target.parentNode.parentNode;
  const id = row.firstElementChild.innerHTML;
  alertify
    .confirm(
      "Are you sure you want to delete the selected contact?",
      function () {
        fetch(url + "delete/" + id, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((json) => {
            alertify.error(json.message, redireccionar());
          })
          .catch((error) => console.log(error));
      },
      function () {
        alertify.error("Cancel");
      }
    )
    .set({ title: "Delete Contact" });
});

//Procedimiento Editar
let idForm = 0;
on(document, "click", ".btnEdit", (e) => {
  const row = e.target.parentNode.parentNode;
  idForm = row.children[0].innerHTML;
  const nameForm = row.children[2].innerHTML;
  const phoneForm = row.children[3].innerHTML;
  const mobileForm = row.children[4].innerHTML;

  names.value = nameForm;
  phone.value = phoneForm;
  mobile.value = mobileForm;
  option = "edit";
  modalDirectory.show();
});

//Procedimiento para Registrar y Editar

formDirectory.addEventListener("submit", (e) => {
  e.preventDefault();
  if (option == "register") {
    fetch(url + "add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: names.value,
        phone: phone.value,
        mobile: mobile.value,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        const newContact = [];
        newContact.push(json);

        alertify
          .alert(json.message, function () {
            alertify.message("OK", location.reload());
          })
          .set({ title: "Register" });
      })
      .catch((error) => console.log(error));
  }
  if (option == "edit") {
    //console.log('OPCION EDITAR')
    fetch(url + "update/" + idForm, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: names.value,
        phone: phone.value,
        mobile: mobile.value,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        alertify
          .alert(json.message, function () {
            alertify.message("OK", location.reload());
          })
          .set({ title: "Update" });
      })
      .catch((error) => console.log(error));
  }

  modalDirectory.hide();
});

//Procedimiento para Buscar

formSearch.addEventListener("submit", (e) => {
  e.preventDefault();

  fetch(url + "search/" + nameSearch.value)
    .then((res) => res.json())
    .then((json) => {
      if (!json.message) {
        alertify
          .alert(
            "Phone : " +
              json.contact.phone +
              "<br>Mobile : " +
              json.contact.mobile,
            function () {
              alertify.message("OK");
            }
          )
          .set({ title: "Phone Details of " + nameSearch.value });
      } else {
        alertify
          .alert(json.message, function () {
            alertify.message("OK");
          })
          .set({ title: "Phone Details" });
      }
    })
    .catch((error) => console.log(error));

  modalSearch.hide();
});

//Procedimiento para Espacios Libres

btnSpace.addEventListener("click", () => {
  fetch(url + "space")
    .then((res) => res.json())
    .then((json) => {
      alertify
        .alert(json.message, function () {
          alertify.message("OK");
        })
        .set({ title: "Free space for add contacts" });
    })
    .catch((error) => console.log(error));
});
