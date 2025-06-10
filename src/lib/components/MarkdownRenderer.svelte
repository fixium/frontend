<script>
	import { marked } from 'marked';
	export let content;
</script>

<div class="prose prose-sm max-w-full">
	{@html marked(content)}
</div>
