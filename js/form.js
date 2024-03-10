document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('add__form');
  form.addEventListener('submit', formSend);

  async function formSend(e) {
    e.preventDefault();

    let error = formValidate(form);

    let formData = new FormData(form);

    if(error === 0) {
      form.classList.add('_sending');
      try {
      let response = await fetch('http://localhost:3000/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData))
      });
      if(response.ok) {
        let result = await response.json();
        console.log(result);
        form.reset();
        form.classList.remove('_sending');
      } else {
        console.error('Server error:', response.status);
        form.classList.remove('_sending');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }

    }
  }

  function formValidate(form) {
    let error = 0;
    let formReq = document.querySelectorAll('._required');

    for(let elem of formReq) {
      const input = elem;
      formRemoveError(input);

      if(input.classList.contains('_email')) {
        if(testEmail(input)) {
          formAddError(input);
          error++;
        }
       } else {
        if(input.value === "") {
            formAddError(input);
            error++;
          }
        }
      }
      return error;
    }

  function formAddError(input) {
    input.parentElement.classList.add('_error');
    input.classList.add('_error');
  }

  function formRemoveError(input) {
    input.parentElement.classList.remove('_error');
    input.classList.remove('_error');
  }

  //Функция тестирования email
  function testEmail(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?w+)*(\.\w{2,8})+$/.test(input.value);
  }
})
