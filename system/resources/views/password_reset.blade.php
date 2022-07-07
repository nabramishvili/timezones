@component('mail::message')
    # Hello {{$user->full_name}}

    Here is your new temporary password. Now you can log in and change the password in your profile.

    {{$newPassword}}
@endcomponent
