const apiURL = 'http://localhost:8081'; //local

tableStyle();

async function tableStyle() {

  const res = await getAll();

  if (res.status == 500) {
    dataTable(null);
    return;
  }

  dataTable(res.data);

  $('#dataTable').removeClass('d-none');
}

function dataTable(dados) {

  $('#dataTable > tbody:last > tr').remove();

  if (!dados) {
    $("#dataTable > tbody:last").append(
      `<tr>
      <th scope="row"> - </th>
      <td> - </td>
      <td> - </td>
      <td> - </td>
      </tr>`
    );
    return;
  }
  
  console.log(dados);

  $.each(dados, function (index, value) {
      console.log(Object.values(value))
    $("#dataTable > tbody:last").append(
      `<tr>
      <th scope="row">${Object.keys(value)}</th>
      <td> ${Object.values(value)} </td>
      </tr>`
    )
  });
}

$('#btnAcquire').click(async function () {
    
    const id = $('#idInput').val();
    
    const res = await acquire(id);
    console.log(res.data.msg)

    $('#msg').text(res.data.msg);
});

$('#btnRenew').click(async function () {
    
    const id = $('#idInput').val();
    
    const res = await renew(id);
    console.log(res.data.msg)

    $('#msg').text(res.data.msg);
});

$('#btnRelease').click(async function () {
    
    const id = $('#idInput').val();
    
    const res = await release(id);
    console.log(res.data.msg)

    $('#msg').text(res.data.msg);
});






/**********************
 * Rests
 **********************/

async function getAll(tipo, companhia) {
  try {
    const response = await axios({
      method: 'post',
      url: `${apiURL}/getAll`,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response;

  } catch (errors) {
    return {
      status: 500
    }
  }
}

async function acquire(id) {
  try {
    const response = await axios({
      method: 'post',
      url: `${apiURL}/acquire`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
          "id" : id
      }
    });
    console.log(response)
    return response;

  } catch (errors) {
    return {
      status: 500
    }
  }
}

async function renew(id) {
  try {
    const response = await axios({
      method: 'post',
      url: `${apiURL}/renew`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
          "id" : id
      }
    });
    console.log(response)
    return response;

  } catch (errors) {
    return {
      status: 500
    }
  }
}

async function release(id) {
  try {
    const response = await axios({
      method: 'post',
      url: `${apiURL}/release`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
          "id" : id
      }
    });
    console.log(response)
    return response;

  } catch (errors) {
    return {
      status: 500
    }
  }
}
