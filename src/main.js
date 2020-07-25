import LowFramworkApp from './LowFramworkApp';
import Movie from './Movie'

// 初始化应用实例
const app = new LowFramworkApp();

app.addView(new Movie());

app.start('app')