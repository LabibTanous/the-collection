@echo off
rem the Collection — Whisper voice memo transcription
rem Usage: drag a .m4a or .wav file onto this .bat, or run:
rem   scripts\transcribe.bat "C:\path\to\voice-memo.m4a"

SET AUDIO=%~1
IF "%AUDIO%"=="" (
  echo Usage: transcribe.bat ^<audio-file^>
  echo Supported: .mp3 .m4a .wav .ogg .flac
  pause
  exit /b 1
)

echo Transcribing: %AUDIO%
echo Model: base (fast, good quality)
echo.

whisper "%AUDIO%" --model base --language en --output_format txt --output_dir uploads/

echo.
echo Done. Check uploads\ folder for the .txt file.
echo Use the text as product copy or SEO content.
pause
