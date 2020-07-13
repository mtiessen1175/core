<?php

namespace Biigle\Tests\Jobs;

use Biigle\Jobs\CreateNewImages;
use Biigle\Jobs\ProcessNewImages;
use Biigle\Tests\ImageTest;
use Biigle\Tests\VolumeTest;
use Queue;
use TestCase;

class CreateNewImagesTest extends TestCase
{
    public function testHandle()
    {
        $volume = VolumeTest::create();
        $filenames = ['a.jpg', 'b.jpg'];

        Queue::fake();
        $this->expectsEvents('images.created');
        with(new CreateNewImages($volume, $filenames))->handle();
        Queue::assertPushed(ProcessNewImages::class);
        $images = $volume->images()->pluck('filename')->toArray();
        $this->assertCount(2, $images);
        $this->assertContains('a.jpg', $images);
        $this->assertContains('b.jpg', $images);
    }
}
