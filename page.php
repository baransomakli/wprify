<?php
use Timber\Timber;

$context = Timber::get_context();
//$post = new TimberPost();
$post = Timber::get_post();
$context['post'] = $post;
Timber::render(array('page-' . $post->post_name . '.twig', 'page.twig'), $context);