<?php
// AlbertMax (Fiverr)
function custom_override_checkout_fields($fields)
{
	unset($fields['billing']['billing_country']);
	unset($fields['billing']['billing_postcode']);
	unset($fields['shipping']['shipping_country']);
	unset($fields['shipping']['shipping_postcode']);
	return $fields;
}
add_filter('woocommerce_checkout_fields' , 'custom_override_checkout_fields');