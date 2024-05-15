<?php

namespace RexTheme\ThePluginName\Tests\Api;

class DummyTest extends \WP_UnitTestCase {

    /**
     * Test REST Server
     *
     * @var WP_REST_Server
     */
    protected $server;


    /**
     * Setup test environment.
     */
    protected function setUp() : void {
        parent::setUp();

        do_action( 'rest_api_init' );
    }

	/**
	 * @return string
	 */
	public function randomName(): string
	{
		return 'test';
	}

    /**
     * @test
     * @group company-rest-api
     */
    public function test_company_dropdown_list_endpoint_exists() {
		$name = $this->randomName();
		self::assertNotNull($name);
    }
}
