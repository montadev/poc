const boutons = document.querySelectorAll('.remote-item-custom');

boutons.forEach(function(bouton) {
  bouton.addEventListener('click', function(event) {
    event.preventDefault();
    event.stopPropagation();

    Swal.fire({
      title: "Attention",
      html: "<h4>En cliquant sur OK</h4>,<h4>vous allez supprimer votre produit</h4>",
      imageUrl: '/_themes/puzzlethemes/fr/images/remove-from-cart.svg', // remplace par le bon chemin
      imageWidth: 60,
      imageHeight: 60,
      imageAlt: 'Icône panier',
      showCancelButton: true,
      confirmButtonColor: "#FF780F",
      cancelButtonColor: "white",
      confirmButtonText: "Ok",
      cancelButtonText: "Retour",
      customClass: {
      popup: 'my-popup',
      title: 'my-title',
      htmlContainer: 'my-html',
      confirmButton: 'my-confirm-button',
      cancelButton: 'my-cancel-button'
      }

    }).then((result) => {
      if (result.isConfirmed) {
        // Rediriger vers l'URL du lien
        window.location.href = bouton.getAttribute('href');
      }
    });
  });
});


document.addEventListener('DOMContentLoaded', function () {
  const checkbox = document.querySelector('.cgv-checkbox');
  const button = document.querySelector('.pass-liv-checkout-custom');

  function toggleButton() {
    button.disabled = !checkbox.checked;
  }

  checkbox.addEventListener('change', toggleButton);
  toggleButton(); // État initial
});