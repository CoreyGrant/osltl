export function openInTab(href){
    const link = document.createElement('a');
    link.style = "display: none";
    link.href = href;
    link.target = "_blank";
    document.body.append(link);
    var result = link.click();
    link.remove();
}