<?php

/**
 * Plugin Name:     Guttenberg Banner Builder
 * Plugin URI:      https://coderex.co
 * Description:     Banner Builder with Guttenberg
 * Version:         1.0.0
 * Author:          Code Rex
 * Author URI:      https://coderex.co
 * Text Domain:     guttenberg-banner-builder
 * Domain Path:     /languages
 * Requires PHP:    7.1
 * Requires WP:     5.5.0
 * Namespace:       GuttenbergBannerBuilder
 */

defined( 'ABSPATH' ) || exit;


final class GuttenbergBannerBuilder {
    /**
     * Plugin version.
     *
     * @var string
     */
    const VERSION = '1.0.0';

    /**
     * Plugin slug.
     *
     * @var string
     *
     * @since 1.0.0
     */
    const SLUG = 'guttenberg-banner-builder';

    /**
     * Holds various class instances.
     *
     * @var array
     *
     * @since 1.0.0
     */
    private $container = [];

    /**
     * Constructor for the PluginName class.
     *
     * Sets up all the appropriate hooks and actions within our plugin.
     *
     * @since 1.0.0
     */
    private function __construct() {
        require_once __DIR__ . '/vendor/autoload.php';

        $this->define_constants();

        add_action( 'admin_enqueue_scripts', array( $this, 'gbb_block_editor_init' ) );

        register_activation_hook( __FILE__, [ $this, 'activate' ] );
        register_deactivation_hook( __FILE__, [ $this, 'deactivate' ] );

        add_action( 'wp_loaded', [ $this, 'flush_rewrite_rules' ] );
        $this->init_plugin();
    }

    /**
	 * Run For builder in specified page
	 *
	 * @param string $hook get Cusrrent page .
	 * @return void
	 */
	public function gbb_block_editor_init( $hook ) {
		global $current_screen;


		if ( 'toplevel_page_guttenberg-banner-builder' !== $hook ) {
			return;
		}

		$script_handle     = 'gbb-form-builder-scripts';
		$script_path       = 'build/index.js';
		$script_asset_path = dirname( __FILE__ ) . '/build/index.asset.php';

		$script_asset = file_exists( $script_asset_path ) ? require $script_asset_path : array('dependencies' => array() ); //phpcs:ignore
		$script_url   = plugins_url( $script_path, __FILE__ );
		$version      = isset( $script_asset['version'] ) ? $script_asset['version'] : '';
		wp_enqueue_script( $script_handle, $script_url, $script_asset['dependencies'], $version ); //phpcs:ignore

		$settings = $this->get_block_editor_settings();
		wp_add_inline_script( $script_handle, 'window.getmrmsetting = ' . wp_json_encode( $settings ) . ';' );
		
		wp_localize_script(
			$script_handle,
			'GBB_Vars_Form',
			array(
				'admin_email'                    => get_option( 'admin_email' ),
			)
		);
		wp_add_inline_script(
			'wp-blocks',
			'wp.blocks.unstable__bootstrapServerSideBlockDefinitions(' . wp_json_encode( get_block_editor_server_block_settings() ) . ');'
		);

		wp_enqueue_script( 'wp-format-library' );
		wp_enqueue_style( 'wp-format-library' );

		wp_enqueue_style('gbb-form-builder-styles', //phpcs:ignore
			plugins_url( 'build/index.css', __FILE__ ), //phpcs:ignore
			array( 'wp-edit-blocks' ) //phpcs:ignore
		);
	}

	/**
	 * Get Block editor Setting
	 */
	public function get_block_editor_settings() {
		$theme_color = $this->get_palette_theme_color();

		$allowed_blocks_for_editor = array(
			'core/paragraph',
			'core/heading',
			'core/image',
			'core/media-text',
			'core/columns',
			'core/html',
			'core/spacer',
			'core/subhead',
			'core/group',
			'core/column',
			'core/cover',
		);

		$allowed_blocks = apply_filters( 'gbb_add_form_builder_blocks_support', $allowed_blocks_for_editor );

		$settings      = array(
			'disableCustomColors'         => get_theme_support( 'disable-custom-colors' ),
			'disableCustomFontSizes'      => get_theme_support( 'disable-custom-font-sizes' ),
			'allowedBlockTypes'           => $allowed_blocks,
			'isRTL'                       => is_rtl(),
			'__experimentalBlockPatterns' => array(),
			'__experimentalFeatures'      => array(
				'appearanceTools' => true,
				'border'          => array(
					'color'  => false,
					'radius' => true,
					'style'  => true,
					'width'  => false,
				),
				'color'           => array(
					'background'       => true,
					'customDuotone'    => false,
					'defaultGradients' => false,
					'defaultPalette'   => false,
					'duotone'          => array(),
					'gradients'        => array(),
					'link'             => false,
					'palette'          => array(
						'theme' => $theme_color['colors'],
					),
					'text'             => true,
				),
				'spacing'         => array(
					'blockGap' => null,
					'margin'   => true,
				),
				'typography'      => array(
					'dropCap'        => false,
					'fontStyle'      => true,
					'fontWeight'     => true,
					'letterSpacing'  => true,
					'textDecoration' => true,
					'textTransform'  => true,
					'fontSize'       => true,
				),
			),
			'disableCustomGradients'      => true,
			'enableCustomLineHeight'      => get_theme_support( 'custom-line-height' ),
			'enableCustomSpacing'         => get_theme_support( 'custom-spacing' ),
			'enableCustomUnits'           => false,
			'keepCaretInsideBlock'        => true,
		);
		$color_palette = current( (array) get_theme_support( 'editor-color-palette' ) );
		if ( false !== $color_palette ) {
			$settings['colors'] = $color_palette;
		} else {
			$settings['colors'] = array();
		}

		if ( $theme_color['font_sizes'] ) {
			$settings['fontSizes'] = $theme_color['font_sizes'];
		} else {
			$settings['fontSizes'] = array();
		}

		return $settings;
	}

    /**
     * Initializes the PluginBoilerplate() class.
     *
     * Checks for an existing PluginBoilerplate() instance
     * and if it doesn't find one, creates it.
     *
     * @since 1.0.0
     *
     * @return GuttenbergBannerBuilder|bool
     */
    public static function init() {
        static $instance = false;

        if ( ! $instance ) {
            $instance = new GuttenbergBannerBuilder();
        }

        return $instance;
    }

    /**
	 * Get Block editor Setting
	 */
	public static function get_palette_theme_color() {
		static $color;
		if ( ! $color ) {
			list($color_palette) = get_theme_support( 'editor-color-palette' );

			if ( empty( $color_palette ) || ! is_array( $color_palette ) || count( $color_palette ) < 2 ) {
				$color_palette = array(
					array(
						'name'  => __( 'Black', 'gbb' ),
						'slug'  => 'black',
						'color' => '#000000',
					),
					array(
						'name'  => __( 'Cyan bluish gray', 'gbb' ),
						'slug'  => 'cyan-bluish-gray',
						'color' => '#abb8c3',
					),
					array(
						'name'  => __( 'White', 'gbb' ),
						'slug'  => 'white',
						'color' => '#ffffff',
					),
					array(
						'name'  => __( 'Pale pink', 'gbb' ),
						'slug'  => 'pale-pink',
						'color' => '#f78da7',
					),
					array(
						'name'  => __( 'Luminous vivid orange', 'gbb' ),
						'slug'  => 'luminous-vivid-orange',
						'color' => '#ff6900',
					),
					array(
						'name'  => __( 'Luminous vivid amber', 'gbb' ),
						'slug'  => 'luminous-vivid-amber',
						'color' => '#fcb900',
					),
					array(
						'name'  => __( 'Light green cyan', 'gbb' ),
						'slug'  => 'light-green-cyan',
						'color' => '#7bdcb5',
					),
					array(
						'name'  => __( 'Vivid green cyan', 'gbb' ),
						'slug'  => 'vivid-green-cyan',
						'color' => '#00d084',
					),
					array(
						'name'  => __( 'Pale cyan blue', 'gbb' ),
						'slug'  => 'pale-cyan-blue',
						'color' => '#8ed1fc',
					),
					array(
						'name'  => __( 'Vivid cyan blue', 'gbb' ),
						'slug'  => 'vivid-cyan-blue',
						'color' => '#0693e3',
					),
					array(
						'name'  => __( 'Vivid purple', 'gbb' ),
						'slug'  => 'vivid-purple',
						'color' => '#9b51e0',
					),
				);
			}

			list($font_sizes) = (array) get_theme_support( 'editor-font-sizes' );

			if ( empty( $font_sizes ) ) {
				$font_sizes = array(
					array(
						'name'      => __( 'Small', 'gbb' ),
						'shortName' => 'S',
						'size'      => 14,
						'slug'      => 'small',
					),
					array(
						'name'      => __( 'Medium', 'gbb' ),
						'shortName' => 'M',
						'size'      => 18,
						'slug'      => 'medium',
					),
					array(
						'name'      => __( 'Large', 'gbb' ),
						'shortName' => 'L',
						'size'      => 24,
						'slug'      => 'large',
					),
					array(
						'name'      => __( 'Larger', 'gbb' ),
						'shortName' => 'XL',
						'size'      => 32,
						'slug'      => 'larger',
					),
				);
			}

			$color = apply_filters(
				'mrm_theme_plate_color',
				array(
					'colors'     => (array) $color_palette,
					'font_sizes' => (array) $font_sizes,
				)
			);
		}

		return $color;
	}

    /**
     * Magic getter to bypass referencing plugin.
     *
     * @since 1.0.0
     *
     * @param $prop
     *
     * @return mixed
     */
    public function __get( $prop ) {
        if ( array_key_exists( $prop, $this->container ) ) {
            return $this->container[ $prop ];
        }

        return $this->{$prop};
    }

    /**
     * Magic isset to bypass referencing plugin.
     *
     * @since 1.0.0
     *
     * @param $prop
     *
     * @return mixed
     */
    public function __isset( $prop ) {
        return isset( $this->{$prop} ) || isset( $this->container[ $prop ] );
    }

    /**
     * Define the constants.
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function define_constants() {
        define( 'GUTTENBERG_BANNER_BUILDER_VERSION', self::VERSION );
        define( 'GUTTENBERG_BANNER_BUILDER_SLUG', self::SLUG );
        define( 'GUTTENBERG_BANNER_BUILDER_FILE', __FILE__ );
        define( 'GUTTENBERG_BANNER_BUILDER_DIR', __DIR__ );
        define( 'GUTTENBERG_BANNER_BUILDER_PATH', dirname( GUTTENBERG_BANNER_BUILDER_FILE ) );
        define( 'GUTTENBERG_BANNER_BUILDER_INCLUDES', GUTTENBERG_BANNER_BUILDER_PATH . '/includes' );
        define( 'GUTTENBERG_BANNER_BUILDER_TEMPLATE_PATH', GUTTENBERG_BANNER_BUILDER_PATH . '/views' );
        define( 'GUTTENBERG_BANNER_BUILDER_URL', plugins_url( '', GUTTENBERG_BANNER_BUILDER_FILE ) );
        define( 'GUTTENBERG_BANNER_BUILDER_BUILD', GUTTENBERG_BANNER_BUILDER_URL . '/build' );
        define( 'GUTTENBERG_BANNER_BUILDER_ASSETS', GUTTENBERG_BANNER_BUILDER_URL . '/assets' );
        define( 'GUTTENBERG_BANNER_BUILDER_PRODUCTION', 'yes' );
    }

    /**
     * Load the plugin after all plugins are loaded.
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function init_plugin() {
        $this->includes();
        $this->init_hooks();

        /**
         * Fires after the plugin is loaded.
         *
         * @since 1.0.0
         */
        do_action( 'guttenberg_banner_builder_loaded' );
    }

    /**
     * Activating the plugin.
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function activate() {
        // Run the installer to create necessary migrations.
//        $this->install();
    }

    /**
     * Placeholder for deactivation function.
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function deactivate() {
        //
    }

    /**
     * Flush rewrite rules after plugin is activated.
     *
     * Nothing being added here yet.
     *
     * @since 1.0.0
     */
    public function flush_rewrite_rules() {
        // fix rewrite rules
    }

    /**
     * Run the installer to create necessary migrations and seeders.
     *
     * @since 1.0.0
     *
     * @return void
     */
    private function install() {
        $installer = new RexTheme\GuttenbergBannerBuilder\Setup\Installer();
        $installer->run();
    }

    /**
     * Include the required files.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function includes() {
        if ( $this->is_request( 'admin' ) ) {
            $this->container['admin_menu'] = new RexTheme\GuttenbergBannerBuilder\Admin\Menu();
        }
		$this->container['assets']   = new RexTheme\GuttenbergBannerBuilder\Assets\LoadAssets();
        $this->container['rest_api'] = new RexTheme\GuttenbergBannerBuilder\REST\Api();
    }

    /**
     * Initialize the hooks.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function init_hooks() {
        // Init classes
        add_action( 'init', [ $this, 'init_classes' ] );

        // Localize our plugin
        add_action( 'init', [ $this, 'localization_setup' ] );

        // Add the plugin page links
        add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), [ $this, 'plugin_action_links' ] );
    }


    /**
     * Instantiate the required classes.
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function init_classes() {
        // Init necessary hooks
        new RexTheme\GuttenbergBannerBuilder\Hooks\Common();
    }

    /**
     * Initialize plugin for localization.
     *
     * @uses load_plugin_textdomain()
     *
     * @since 0.2.0
     *
     * @return void
     */
    public function localization_setup() {
        load_plugin_textdomain( 'guttenberg-banner-builder', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );

        // Load the React-pages translations.
        if ( is_admin() ) {
            // Load wp-script translation for plugin-name-app
            wp_set_script_translations( 'plugin-name-app', 'guttenberg-banner-builder', plugin_dir_path( __FILE__ ) . 'languages/' );
        }
    }


    /**
     * What type of request is this.
     *
     * @since 0.2.0
     *
     * @param string $type admin, ajax, cron or frontend
     *
     * @return bool
     */
    private function is_request( $type ) {
        switch ( $type ) {
            case 'admin':
                return is_admin();

            case 'ajax':
                return defined( 'DOING_AJAX' );

            case 'rest':
                return defined( 'REST_REQUEST' );

            case 'cron':
                return defined( 'DOING_CRON' );

            case 'frontend':
                return ( ! is_admin() || defined( 'DOING_AJAX' ) ) && ! defined( 'DOING_CRON' );
        }
    }

    /**
     * Plugin action links
     *
     * @param array $links
     *
     * @since 0.2.0
     *
     * @return array
     */
    public function plugin_action_links( $links ) {
        $links[] = '<a href="' . admin_url( 'admin.php?page=plugin_name#/settings' ) . '">' . __( 'Settings', 'guttenberg-banner-builder' ) . '</a>';
        $links[] = '<a href="#" target="_blank">' . __( 'Documentation', 'guttenberg-banner-builder' ) . '</a>';

        return $links;
    }
}



/**
 * Initialize the main plugin.
 *
 * @since 1.0.0
 *
 * @return \GuttenbergBannerBuilder|bool
 */
function the_guttenberg_banner_builder_main_function() {
    return GuttenbergBannerBuilder::init();
}

/*
 * Kick-off the plugin.
 *
 * @since 1.0.0
 */
the_guttenberg_banner_builder_main_function();
