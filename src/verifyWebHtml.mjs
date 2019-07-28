let tmp = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="zh-tw">

    <head>
        <meta http-equiv="content-type" content="text/html charset=UTF-8" />
        <title>{rdWebName}</title>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.slim.js"></script>

    </head>

    <body style="padding:0; margin:0;">
    
        <div style="display:flex; align-items:center; justify-content:center;">
            
            <div style="padding:30px; font-family:'Microsoft JhengHei';">
            
                <div style="margin:10px 0px 20px 0px; display:flex; align-items:center;">

                    <div style="margin-right:10px;">
                        {rdLogo}
                    </div>

                    <div style="margin:-5px 0px 0px 0px;">
                        <div style="margin:0px 0px 0px 0px; font-size:12pt; color:#999;">Single Sign-On</div>
                        <div style="margin:-3px 0px 0px 0px; font-size:24pt;">{rdWebName}</div>
                    </div>

                </div>
    
                <div style="padding:20px; text-align:center; background-color:#fee; border-radius:10px;">

                    <div style="">{rdMessage}</div>
    
                    <div id="cd" style="margin:10px 0px 0px 0px; font-size:10pt; color:#999; display:none;"></div>

                </div>
                
            </div>
            
        </div>
        
        <script>

            function countdown() {
                $('#cd').show()
                let n = 5
                let tmp = '{rdCountdownMessage}'
                $('#cd').text(tmp.replace('{s}', n))
                setInterval(function() {
                    n -= 1
                    if (n<=0) {
                        window.location.href = '{rdWebUrl}'
                    }
                    $('#cd').text(tmp.replace('{s}', n))
                }, 1000)
            }
            if ({rdCountdown}) {
                countdown()
            }

        </script>

    </body>

</html>`

export default tmp
