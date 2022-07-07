@component('mail::message')
    # Hello {{$user->full_name}}

    Please verify password reset request with this link:

    @if(config('app.env')==='production')
        {{str_replace( 'http://', 'https://', route('reset_password', $user->password_reset_token) )}}
    @else
        {{route('reset_password', $user->password_reset_token)}}
    @endif
@endcomponent
