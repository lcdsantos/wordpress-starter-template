<?php get_header(); ?>

    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <h1><?php _e('Error 404'); ?></h1>
            <p><?php _e('Page not found.'); ?></p>
        </article>
    <?php endwhile; endif; ?>

<?php get_footer(); ?>
