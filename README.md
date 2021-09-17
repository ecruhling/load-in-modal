# Load In Modal

A JavaScript plugin (with no jQuery dependency) that integrates with Bootstrap's modal component to load WordPress content in a #content-modal when clicking on links with the 'load-in-modal' class.

You can also add a class 'load-raster-image-in-modal', which will load an image directly in a modal.

The script will attempt to load the content via REST first, by using the 'data-rest-path' attribute on the link.
if that does not work, it will load the content using the href URL and in that case it will use only the content from the
'article' or .main HTML element.

Finally, you may also add a data attribute 'data-modal-class'. This class gets added to the modal and is useful for
additional styling for the modal, dependent on the link. The class must always begin with 'modal-class-', to ensure that
the class is removed correctly on subsequent modal openings.

Data attributes examples to add to the link for the REST implementation:

For pages:
data-rest-path="/wp-json/wp/v2/pages?slug={slug}"

For posts:
data-rest-path="/wp-json/wp/v2/posts?slug={slug}"

Where {slug} is the WordPress-generated slug for that particular page or post.

###Requirements:
* A loading element with an id of 'loading' that will be shown or hidden while the content is loading.
* Bootstrap 5 spinner SCSS (for the #loading div).
* A Bootstrap 5 modal with an id of 'content-modal'.
* Bootstrap 5 Modal JS.

Included are two Laravel Blade templates, one for the loading background, and the other for the content modal.

Also included is the SCSS for the #loading div.