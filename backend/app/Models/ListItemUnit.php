<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\ListItemUnit
 *
 * @property int $id
 * @property string $unit_name
 * @method static \Illuminate\Database\Eloquent\Builder|ListItemUnit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ListItemUnit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ListItemUnit query()
 * @method static \Illuminate\Database\Eloquent\Builder|ListItemUnit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ListItemUnit whereUnitName($value)
 * @mixin \Eloquent
 */
class ListItemUnit extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    public $timestamps = false;
}
