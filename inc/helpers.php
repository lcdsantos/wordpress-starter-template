<?php

/**
 * Get CSS file path
 * @param  string $file Filename
 * @return string       File path
 */
function css($file = '') {
    return CSS_PATH . $file;
}

/**
 * Get JavaScript file path
 * @param  string $file Filename
 * @return string       File path
 */
function javascript($file = '') {
    return JS_PATH . $file;
}

/**
 * Get image file path
 * @param  string $file Filename
 * @return string       File path
 */
function image($file = '') {
    return IMAGES_PATH . $file;
}

/**
 * Get site base URL
 * @param  string $url Path
 * @return string      Base path
 */
function base_url($url = '') {
    return BASE_URL . $url;
}

/**
 * Get asset path
 * @param  string $file File name
 * @param  string $dir  Assets directory
 * @return string       Asset path
 */
function asset($file, $dir = 'assets') {
    return get_template_directory_uri() . '/' . ltrim($dir, '/') . '/' . ltrim($file, '/');
}

/**
 * Get file path from asset manifest
 * @param  string $file           File path
 * @param  string $buildDirectory Assets directory
 * @return string                 Versioned file path
 */
function manifest($file, $buildDirectory = 'assets') {
    $manifest = [];
    $buildDirectory = '/' . ltrim($buildDirectory, '/');

    if (empty($manifest)) {
        $path = get_template_directory() . $buildDirectory . '/rev-manifest.json';

        if (file_exists($path)) {
            $manifest = json_decode(file_get_contents($path), true);
        }
    }

    $file = ltrim($file, '/');

    if (isset($manifest[$file])) {
        return asset($manifest[$file], $buildDirectory);
    }

    $unversioned = get_template_directory() . $buildDirectory . '/' . $file;

    if (file_exists($unversioned)) {
        return asset($file, $buildDirectory);
    }
}
