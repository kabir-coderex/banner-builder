<?php

namespace RexTheme\GuttenbergBannerBuilder\Assets;

/**
 * Load assets class
 *
 * Responsible for managing all of the assets (CSS, JS, Images, Locales).
 */
class LoadAssets {

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'register_all_scripts' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_assets' ] );
	}

	/**
	 * Register all scripts and styles.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_all_scripts() {
		$this->register_styles( $this->get_styles() );
		$this->register_scripts( $this->get_scripts() );
	}

	/**
	 * Get all styles.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function get_styles(): array {
		return [
			'guttenberg-banner-builder-css' => [
				'src'     => GUTTENBERG_BANNER_BUILDER_BUILD . '/index.css',
				'version' => GUTTENBERG_BANNER_BUILDER_VERSION,
				'deps'    => [],
			],
		];
	}

	/**
	 * Get all scripts.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function get_scripts(): array {
		$dependency = require_once GUTTENBERG_BANNER_BUILDER_DIR . '/build/index.asset.php';

		return [
			'guttenberg-banner-builder-app' => [
				'src'       => GUTTENBERG_BANNER_BUILDER_BUILD . '/index.js',
				'version'   => $dependency['version'],
				'deps'      => $dependency['dependencies'],
				'in_footer' => true,
			],
		];
	}

	/**
	 * Register styles.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_styles( array $styles ) {
		foreach ( $styles as $handle => $style ) {
			wp_register_style( $handle, $style['src'], $style['deps'], $style['version'] );
		}
	}

	/**
	 * Register scripts.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_scripts( array $scripts ) {
		foreach ( $scripts as $handle =>$script ) {
			wp_register_script( $handle, $script['src'], $script['deps'], $script['version'], $script['in_footer'] );
		}
	}

	/**
	 * Enqueue admin styles and scripts.
	 *
	 * @since 1.0.0
	 * @since 0.3.0 Loads the JS and CSS only on the Dynamic Discount admin page.
	 *
	 * @return void
	 */
	public function enqueue_admin_assets() {
		if ( ! is_admin() || ! isset( $_GET['page'] ) || sanitize_text_field( wp_unslash( $_GET['page'] ) ) !== 'guttenberg-banner-builder' ) {
			return;
		}

		wp_enqueue_style( 'guttenberg-banner-builder-css' );
		wp_enqueue_script( 'guttenberg-banner-builder-app' );
	}
}
