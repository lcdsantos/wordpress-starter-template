<?php get_header(); ?>

    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
            <?php the_excerpt(); ?>
            <a href="<?php the_permalink(); ?>"><?php _e('leia mais'); ?></a>
        </article>
    <?php endwhile; endif; ?>

    <div class="pagination">
        <?php
            global $wp_query;
            $big = 999999999; // Precisa ser um número alto e improvável

            echo paginate_links( array(
                'base'      => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
                'format'    => '?paged=%#%',
                'current'   => max( 1, get_query_var('paged') ),
                'total'     => $wp_query->max_num_pages,
                'prev_text' => __(' <span class="prev">&laquo;</span> '),
                'next_text' => __(' <span class="next">&raquo;</span> '),
                'Show_all'  => false,
                'end_size'  => 1,
                'mid_size'  => 2,
            ));
        ?>
    </div>

<?php get_footer(); ?>
