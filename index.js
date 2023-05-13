


const setup = () => {
  $(".card").on(("click"), function () {
    $(this).toggleClass("flip");
  });
}

$(document).ready(setup)