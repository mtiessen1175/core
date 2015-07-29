<?php

use Dias\Role;

class AnnotationControllerTest extends TestCase {

   public function testIndex() {
      $project = ProjectTest::create();
      $project->save();
      $transect = TransectTest::create();
      $transect->save();
      $image = ImageTest::create();
      $image->transect()->associate($transect);
      $image->save();
      $project->addTransectId($transect->id);
      $user = UserTest::create();
      $user->save();

      // not logged in
      $this->get('annotate/'.$image->id);
      $this->assertResponseStatus(302);

      // doesn't belong to project
      $this->be($user);
      $this->get('annotate/'.$image->id);
      $this->assertResponseStatus(401);

      $this->be($project->creator);
      $this->get('annotate/'.$image->id);
      $this->assertResponseOk();
      $this->assertViewHas('user');
      $this->assertViewHas('image');

      // doesn't exist
      $this->get('annotate/-1');
      $this->assertResponseStatus(404);
   }
}
