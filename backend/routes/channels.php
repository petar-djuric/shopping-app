<?php

use Illuminate\Support\Facades\Broadcast;


Broadcast::channel('group.{groupId}', function ($user, $groupId) {
    return $user->group_id === (int) $groupId;
});
