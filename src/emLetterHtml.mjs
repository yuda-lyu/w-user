let tmp = `<table style="width:100%;">
<tbody>

<tr style="display:none;">
    <td>
        {emMessage}
    </td>
</tr>

<tr>
    <td style="padding:30px; font-family:'Microsoft JhengHei'; background-color:#666; text-align:center;">
        <a style="color:#aaffff; font-size:24pt; text-decoration:none;" href="{emWebUrl}" target="_blank">{emWebName}</a>
        <p style="margin:10px 0px 0px 0px; color:#eee; font-size:12pt;">
            {emWebDescription}
        </p>
    </td>
</tr>

<tr>
    <td style="padding:20px; font-family:'Microsoft JhengHei';">
        <p style="">{emMessage}</p>
    </td>
</tr>

<tr>
    <td style="padding:20px; font-family:'Microsoft JhengHei'; background-color:#f5f5f5; text-align:center;">
        <p style="color:#f26; font-size:11pt;">【{emLetterDoNotReplayMessage}】</p>
        <p style="">{emLetterTeamMessage}</p>
        <p style="padding:1em 0px 0px 0px; color:#aaa;">{emLetterLinks}</p>
    </td>
</tr>

</tbody>
</table>`

export default tmp
