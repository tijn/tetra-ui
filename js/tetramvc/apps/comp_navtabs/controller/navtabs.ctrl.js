tetra.controller.register('navtabs', {
	scope: 'comp_navtabs', // application name
	use: ['navtabs'], // list of required models
	
	constr: function(me, app, page, orm) {
		return {
			events: {
				model: { // events received from model
					'navtabs': { // model name
						
						'append': function(col) {
							var obj = col[0];
							me.currentContent = obj.get('html');
							app
								.notify('end loading', {
									targetId : obj.get('targetId')
								})
								.notify('set content', {
									targetId : obj.get('targetId'),
									content : me.currentContent,
									tabRef : me.tabRef[me.tabRef.length-1]
								})
							;
						},
						'error': function(error) {
							
							me.tabRef.pop();
							
							app
								.notify('end loading', {
									targetId : error.obj.get('targetId')
								})
								.notify('show error')
								.notify('set content', {
									targetId : error.obj.get('targetId'),
									content : me.currentContent,
									tabRef : me.tabRef[me.tabRef.length-1]
								})
							;
						}
					}
				},
				
				view: { // events received from view
					'show tab': function(data) {
						
						me.tabRef.push(data.url);

						app.notify('start loading', {
							targetId: data.targetId
						});

						data.uriParams = { url: data.url };
						orm('navtabs').fetch(data);
						//orm('navtabs').create(data).save({ uriParams: { url: data.url } });
						
					}
				}
			},
			
			methods: {
				init: function() {
					me.currentContent = '';
					me.tabRef = [];
				}
			}
		};
	}
});
