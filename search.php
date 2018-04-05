<?php get_header(); ?>

    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
    <?php endwhile; ?>
    <?php else: ?>
        <p><?php _e('Nenhum resultado encontrado.'); ?></p>
    <?php endif; ?>

<?php get_footer(); ?>
