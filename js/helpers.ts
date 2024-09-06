export function openInTab(href){
    const link = document.createElement('a');
    link.style = "display: none";
    link.href = href;
    link.target = "_blank";
    document.body.append(link);
    var event = new Event('click');
    var result = link.dispatchEvent(event);
    console.log(result);
    //link.remove();
}