<?php

use Dias\Image;

class ApiImageControllerTest extends ModelWithAttributesApiTest
{
    protected function getEndpoint()
    {
        return '/api/v1/images';
    }

    protected function getModel()
    {
        $model = ImageTest::create();
        $this->project->addTransectId($model->transect->id);

        return $model;
    }

    private $image;

    public function setUp()
    {
        parent::setUp();
        $this->image = ImageTest::create();
        $this->project->addTransectId($this->image->transect->id);
    }

    public function testShow()
    {
        $this->doTestApiRoute('GET', '/api/v1/images/1');

        // api key authentication
        $this->callToken('GET', '/api/v1/images/1', $this->user);
        $this->assertResponseStatus(401);

        $this->callToken('GET', '/api/v1/images/-1', $this->guest);
        $this->assertResponseStatus(404);

        // session cookie authentication
        $this->be($this->guest);
        $r = $this->call('GET', '/api/v1/images/1');
        $this->assertStringStartsWith('{', $r->getContent());
        $this->assertStringEndsWith('}', $r->getContent());
        $this->assertContains('"transect"', $r->getContent());
        $this->assertContains('"exif"', $r->getContent());
        $this->assertContains('"width"', $r->getContent());
        $this->assertContains('"height"', $r->getContent());
    }

    public function testShowThumb()
    {
        $this->doTestApiRoute('GET', '/api/v1/images/1/thumb');

        // api key authentication
        $this->callToken('GET', '/api/v1/images/1/thumb', $this->user);
        $this->assertResponseStatus(401);

        $this->callToken('GET', '/api/v1/images/-1/thumb', $this->guest);
        $this->assertResponseStatus(404);

        // session cookie authentication
        $this->be($this->guest);
        $r = $this->call('GET', '/api/v1/images/1/thumb');
        $this->assertResponseOk();
        $this->assertEquals('image/jpeg', $r->headers->get('content-type'));
    }

    public function testShowFile()
    {
        $this->doTestApiRoute('GET', '/api/v1/images/1/file');

        // api key authentication
        $this->callToken('GET', '/api/v1/images/1/file', $this->user);
        $this->assertResponseStatus(401);

        $this->callToken('GET', '/api/v1/images/-1/file', $this->guest);
        $this->assertResponseStatus(404);

        // session cookie authentication
        $this->be($this->guest);
        $r = $this->call('GET', '/api/v1/images/1/file');
        $this->assertResponseOk();
        $this->assertEquals('image/jpeg', $r->headers->get('content-type'));
    }
}