<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPassword extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The user instance
     *
     * @var User
     */
    public $user;
    public $newPassword;

    /**
     * Create a new message instance.
     *
     * @param User $user
     * @param $newPassword
     */
    public function __construct(User $user, $newPassword)
    {
        $this->user = $user;
        $this->newPassword = $newPassword;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('support@timezones.test')->markdown('password_reset')->subject('Your temporary password');
    }
}
