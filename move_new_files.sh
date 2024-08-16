#!/bin/bash
# Source and destination directories
SOURCE_DIR="/root/Reporter-Telegram-Bot/6354737880:AAHakoLZuGulCYM6Pjx7bsJj8ooy5FgYTO4"
DEST_DIR="/var/www/telegram-image-src/"

# Ensure destination directory exists
mkdir -p "$DEST_DIR"

echo "Monitoring $SOURCE_DIR for new files..."

# Monitor the source directory recursively for new files
inotifywait -m -r -e create --format "%w%f" "$SOURCE_DIR" | while read NEW_FILE
do
    echo "New file detected: $NEW_FILE"
    # Determine the relative path and destination path
    REL_PATH="${NEW_FILE#$SOURCE_DIR}"
    DEST_PATH="$DEST_DIR$REL_PATH"
    DEST_DIR_PATH=$(dirname "$DEST_PATH")
    echo "Moving $NEW_FILE to $DEST_PATH"

    # Ensure destination directory exists
    mkdir -p "$DEST_DIR_PATH"
    
    # Move the new file to the destination directory
    cp "$NEW_FILE" "$DEST_PATH"
    if [ $? -eq 0 ]; then
        echo "Moved $NEW_FILE to $DEST_PATH successfully"
    else
        echo "Failed to move $NEW_FILE to $DEST_PATH"
    fi
done