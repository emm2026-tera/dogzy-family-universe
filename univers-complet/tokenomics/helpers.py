import pymupdf as fitz
FN={'Helvetica':'F1','Times-Bold':'F2','Helvetica-Oblique':'F3','Helvetica-Bold':'F4'}
MF={'Helvetica':fitz.Font('helv'),'Helvetica-Bold':fitz.Font('hebo'),'Helvetica-Oblique':fitz.Font('heit'),'Times-Bold':fitz.Font('tibo')}
def rgb(h): return tuple(int(h[i:i+2],16)/255 for i in (0,2,4))
CREAM='f5f0e6'; GOLD='d4af37'; GREY='b3a98f'
BUF={}
def tl(text,font,size): return MF[font].text_length(text,size)
def wrap(text,font,size,width):
    words=text.split(' '); lines=[]; cur=''
    for w in words:
        t=(cur+' '+w) if cur else w
        if tl(t,font,size)<=width or not cur: cur=t
        else: lines.append(cur); cur=w
    if cur: lines.append(cur)
    return lines
def esc(s):
    b=s.encode('cp1252')
    return b.replace(b'\\',b'\\\\').replace(b'(',b'\\(').replace(b')',b'\\)')
def put(page,text,font,size,color,x,y,align='left',fit=None):
    if fit:
        while tl(text,font,size)>fit and size>5: size-=0.25
    w=tl(text,font,size)
    if align=='center': x=x-w/2
    elif align=='right': x=x-w
    r,g,b=rgb(color)
    op=b'BT /%s %.2f Tf %.4f %.4f %.4f rg 1 0 0 1 %.2f %.2f Tm (' % (FN[font].encode(),size,r,g,b,x,page.rect.height-y) + esc(text) + b') Tj ET\n'
    BUF.setdefault(page.number,[]).append(op)
    return size
def para(page,text,font,size,color,x,y,pitch,width,maxlines=None,align='left'):
    lines=wrap(text,font,size,width)
    if maxlines and len(lines)>maxlines: raise ValueError(f'too many lines ({len(lines)}>{maxlines}): {text[:70]}')
    for i,l in enumerate(lines): put(page,l,font,size,color,x,y+i*pitch,align)
    return len(lines)
def redact(page,rects):
    for r in rects: page.add_redact_annot(fitz.Rect(r),fill=False)
    page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE,graphics=fitz.PDF_REDACT_LINE_ART_NONE)
FONTDICT='<</F1 2 0 R/F2 4 0 R/F3 5 0 R/F4 7 0 R>>'
def setfonts(doc,p):
    t,v=doc.xref_get_key(p.xref,'Resources')
    if t=='xref':
        rx=int(v.split()[0]); ft,fv=doc.xref_get_key(rx,'Font')
        if ft=='xref': doc.xref_set_key(rx,'Font',FONTDICT)
        else:
            for k,x in (('F1',2),('F2',4),('F3',5),('F4',7)): doc.xref_set_key(rx,'Font/'+k,f'{x} 0 R')
    else:
        ft,fv=doc.xref_get_key(p.xref,'Resources/Font')
        if ft in ('null','xref'): doc.xref_set_key(p.xref,'Resources/Font',FONTDICT)
        else:
            for k,x in (('F1',2),('F2',4),('F3',5),('F4',7)): doc.xref_set_key(p.xref,'Resources/Font/'+k,f'{x} 0 R')
def flush(doc):
    for pn,ops in BUF.items():
        page=doc[pn]; page.wrap_contents(); setfonts(doc,page)
        x=doc.get_new_xref(); doc.update_object(x,'<<>>'); doc.update_stream(x,b'q\n'+b''.join(ops)+b'Q\n')
        cs=page.get_contents()
        doc.xref_set_key(page.xref,'Contents','['+' '.join(f'{c} 0 R' for c in cs+[x])+']')
    BUF.clear()
def footer(page,num,text):
    put(page,text,'Helvetica',8,GREY,54,761.74)
    put(page,str(num),'Helvetica',8,GREY,558,761.74,align='right')
def card(page,r):
    page.draw_rect(fitz.Rect(r),color=(0.165,0.165,0.188),fill=(0.09,0.09,0.11),width=0.75)
def new_page_base(doc,idx):
    p=doc.new_page(idx,width=612,height=792)
    p.draw_rect(p.rect,color=None,fill=(0.043137,0.043137,0.05098),width=0)
    p.draw_line((54,94),(114,94),color=(0.831373,0.686275,0.215686),width=1)
    p.draw_line((54,748),(558,748),color=(0.164706,0.164706,0.188235),width=0.5)
    return p
