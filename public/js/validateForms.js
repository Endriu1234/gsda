(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()

function validateHtmlList(htmlDocument, input, listId, allowEmpty) {
    console.log('check triggered');

    const list = htmlDocument.querySelector(`#${listId}`);

    let isCorrect = false;

    if (allowEmpty && !input.value)
        isCorrect = true;
    else {

        for (const opt of list.options) {
            if (input.value == opt.value) {
                isCorrect = true;
                break;
            }
        };
    }

    if (isCorrect)
        input.setCustomValidity('');
    else
        input.setCustomValidity('Wrong value');
}
