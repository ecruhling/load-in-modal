/**
 * Load In Modal
 *
 * A JavaScript plugin (with no jQuery dependency) that integrates with Bootstrap's modal component
 * to load WordPress content in a #content-modal when clicking on links with the 'load-in-modal' class.
 *
 * You can also add a class 'load-raster-image-in-modal', which will load an image directly in a modal.
 *
 * The script will attempt to load the content via REST first, by using the 'data-rest-path' attribute on the link.
 * if that does not work, it will load the content via URL and then use only the content from the
 * <article> or .main HTML element.
 *
 * Finally, you may also add a data attribute 'data-modal-class'. This class gets added to the modal and is useful for
 * additional styling for the modal, dependent on the link. The class must always begin with 'modal-class-', to ensure that
 * the class is removed correctly on subsequent modal openings.
 *
 * Data attributes examples to add to the link for the REST implementation:
 *
 * For pages:
 * data-rest="/wp-json/wp/v2/pages?slug=SLUG"
 *
 * For posts:
 * data-rest="/wp-json/wp/v2/posts?slug=SLUG"
 *
 * Where SLUG is the WordPress-generated slug for that particular page or post.
 *
 * Requirements:
 *
 *  • A loading element called #loading that will be shown or hidden while the content is loading.
 *  • A Bootstrap 5 modal with an id of '#content-modal'.
 *  • Bootstrap 5 Modal JS.
 *
 */

// import Bootstrap Modal JS.
import Modal from 'bootstrap/js/src/modal';

function loadInModal() {

  // variables.
  const bootstrapModal = new Modal(document.getElementById('content-modal'));
  const modalBody = document.querySelector('.content-modal-body');
  const modalElement = document.querySelector('#content-modal');
  const loading = document.querySelector('#loading');

  // listen to all click events, and then filter out the ones you don't want
  // this is so the links can be added dynamically.
  document.body.addEventListener('click', event => {

    // return early if the link does not contain the 'load-in-modal' class.
    if (!event.target.classList.contains('load-in-modal')) return;

    // prevent default, since these are otherwise href links.
    event.preventDefault();
    // get the modifier class from the data-modal-class attribute, if it exists.
    const modalClass = event.target.dataset.modalClass ? event.target.dataset.modalClass : null;
    // remove the class from the modal first, if it exists from a previous modal show.
    for (let i = modalElement.classList.length - 1; i >= 0; i--) {
      const className = modalElement.classList[i];
      if (className.startsWith('modal-class')) {
        modalElement.classList.remove(className);
      }
    }
    // if the modifier class exists, add it to the modal.
    if (modalClass) {
      modalElement.classList.add(modalClass);
    }
    // show the #loading element.
    loading.classList.add('show');
    // if this has an additional 'load-raster-image-in-modal' class,
    // then just create an image directly in the modal and show it,
    // no need for any AJAX.
    if (event.target.classList.contains('load-raster-image-in-modal')) {
      // get all the img attributes from the href of the clicked link,
      // and set up a new img element.
      const image = '<img src="' + event.target.attr('href') + '" alt="' + event.target.data('alt') + '" class="' + event.target.data('class') + '" />';
      // show the modal
      bootstrapModal.show();
      modalElement.innerHTML = image;
      loading.classList.remove('show');
      // otherwise perform ajax and get the link data.
    } else {

      // get the REST path from the data-rest-path attribute, if it exists.
      const restPath = event.target.dataset.restPath ?? null;

      // init an XML HTTP request, emulating AJAX.
      let xmlhttp = new XMLHttpRequest();

      // get the XML data, using the REST path OR the href of the clicked link, REST path preferred.
      xmlhttp.open('GET', restPath ? restPath : event.target.href, true);
      xmlhttp.send();

      // bind to the request's statechange.
      xmlhttp.onreadystatechange = function () {
        // request is completed.
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
          if (xmlhttp.status === 200) { // request was successful.

            if (restPath) { // load the content via REST.
              const responseJSON = JSON.parse(xmlhttp.responseText);
              // check to make sure there is content in the JSON object. if so, display it
              // if there is no content at the route, the modal displays empty, which
              // is better than throwing an error, or displaying the loading element forever.
              if (responseJSON.length !== 0 && responseJSON[0].content.rendered !== null && responseJSON[0].content.rendered !== undefined) {
                // place the HTML into the modal body.
                modalBody.innerHTML = responseJSON[0].content.rendered;
              } else {
                console.log('Check the REST path!');

                // hide the #loading element.
                loading.classList.remove('show');

                return null;
              }

            } else { // fallback to use the link href.
              // create a temporary div, place all the content
              // there and then get the portion you want.
              const tempElement = document.createElement('div');
              tempElement.innerHTML = xmlhttp.responseText;
              // get the content from <article> first, but fall back to .main if there is no <article> element.
              const bodyContent = tempElement.querySelector('article') ? tempElement.querySelector('article') : tempElement.getElementsByClassName('main'); // get article, if not exist, get .main;
              if (bodyContent !== null && bodyContent !== undefined) {
                // place the HTML into the modal body.
                modalBody.innerHTML = bodyContent[0].innerHTML;
              }
              // remove the temp element.
              tempElement.remove();
            }

            // show the modal.
            bootstrapModal.show();

            // ERROR checking:
          } else if (xmlhttp.status === 400) {
            console.log('Error 400 (Bad Request)');
          } else {
            console.log('Check the URL!');
          }

          // hide the #loading element.
          loading.classList.remove('show');

        }
      };

    }
  })

  // when the modal is hidden, remove the content
  // this way, there is no chance that old content remains in the modal
  // on subsequent displays
  modalElement.addEventListener('hide.bs.modal', function () {
    modalBody.innerHTML = '';
  })

}

export default loadInModal;

