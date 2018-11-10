# Berrisoft-Facts-eXtractor

Extracts facts as JSON structure.

## Usage

`bfx file.txt`

By default, JSON file will be saved as data.json in current directory.

To specified an output file, use

`bfx file.txt --output extracted.json`

## Input file structure

Text file must follow below structure:

```text
[Speaker 1] (context) Lorem ipsum dolor sit amet, consectetuer adipiscing elit...
[Speaker 2] Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 


[Speaker] Aliquam lorem ante, dapibus in, viverra quis, feugiat a...
```

