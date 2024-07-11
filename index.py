import  sys
import jieba # 分词
from wordcloud import WordCloud # 生成词云
import matplotlib.pyplot as plt # 绘制图表


text = sys.argv[1] # 从命令行获取输入的文本（nodejs）

wordText = jieba.cut(text) # 分词

text = " ".join(wordText) # 用空格拼接分词结果

# 生成词云
font = './font.ttf'

wc = WordCloud(font_path=font, background_color="white", max_words=2000, max_font_size=80) # 生成词云对象

wc.generate(text) # 生成词云

plt.imshow(wc) # 显示词云

plt.axis("off") # 关闭坐标轴

plt.show() # 显示
