<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Timezone extends Model
{

    /**
     * The attributes that should be guarded.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     *
     * Relationship with user: timezone belongs to user
     *
     * @return BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
