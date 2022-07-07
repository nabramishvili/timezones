<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Timezones</title>
    <!-- Styles -->
    @if(config('app.env')==='local')
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    @else
        <link href="{{ secure_asset('css/app.css') }}" rel="stylesheet">
    @endif
</head>
<body>
<div id="app"></div>

@if(config('app.env')==='local')
    <script src="{{ asset('js/app.js') }}"></script>
@else
    <script src="{{ secure_asset('js/app.js') }}"></script>
@endif

</body>
</html>
