<?php
namespace RexTheme\GuttenbergBannerBuilder\Setup;

use RexTheme\GuttenbergBannerBuilder\Common\Keys;


class Installer {

    /**
     * Run the installer.
     *
     * @since 1.0.0
     */
    public function run() {
        // Update the installed version.
        $this->add_version();

        // Register and create tables.
        $this->register_table_names();
        $this->create_tables();
    }


    /**
     * Add time and version on DB.
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function add_version(): void {
        $installed = get_option( Keys::GUTTENBERG_BANNER_BUILDER_INSTALLED );
        if ( ! $installed ) {
            update_option( Keys::GUTTENBERG_BANNER_BUILDER_INSTALLED, time() );
        }
        update_option( Keys::GUTTENBERG_BANNER_BUILDER_VERSION, GUTTENBERG_BANNER_BUILDER_VERSION );
    }


    /**
     * Register table names.
     *
     * @since 1.0.0
     *
     * @return void
     */
    private function register_table_names(): void {
        global $wpdb;

        // Register the tables to wpdb global.
        $wpdb->plugin_name = $wpdb->prefix . 'plugin_name';
    }


    /**
     * Create necessary database tables.
     *
     * @since JOB_PLACE_
     *
     * @return void
     */
    public function create_tables() {
        if ( ! function_exists( 'dbDelta' ) ) {
            require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        }

        // Run the database table migrations.
        \RexTheme\PluginName\Databases\Migrations\PluginNameMigration::migrate();
    }
}
