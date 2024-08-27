const fs = require('fs');

function decreaseSVGdetail() {
    // Read the file content
    fs.readFile('../images/nyc.svg', 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        // Split the content into lines
        // lines.forEach(line => {
        // Use regex to find all non-whitespace sequences
        // const elements = data.match(/<symbol[^>]*>[\s\S]*?<\/symbol>/g);
        const elements = data.match(/<[^>]+>[\s\S]*?<\/[^>]+>/g);
        // const elements = data.match(/<([a-zA-Z]+)([^<]+)*(?:>(.*?)<\/\1>|\/>)/g);
        // console.log(elements.length);
        // const elements = line.match(/<[^>]+>([^<]*)<\/[^>]+>|<[^>]+\/>/g);
        var modifiedContent = '';
        // console.log(elements)
        // modifiedContent += '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" width="6012" height="5888" viewBox="-249.944 -174.252 6012 5888">' + '\n'
        if (elements) {
            for (var i = 0; i < elements.length; i += 32) {
                // Keep every other element
                // console.log(elements[i], "LINE ", i)
                // if (i > 5) {
                //     return
                // }
                modifiedContent += elements[i] + '\n';
            }
        } else {
            console.error('failed')
        }
        modifiedContent += '</svg>'
        fs.writeFile('../images/nycmodified.svg', modifiedContent, (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log(`It went from ${data.length} to ${modifiedContent.length} characters ${modifiedContent.length/data.length}% decrease`)
                console.log('File written successfully');
            }
        });
        // });
    });
}

decreaseSVGdetail()