# name: widget-gamification
# version: 0.1
# authors: SMHassanAlavi

register_asset 'stylesheets/padpors-gamification.scss'


PLUGIN_NAME = "widget-gamification".freeze

after_initialize do

	module ::WidgetGamification
		class Engine < ::Rails::Engine
			engine_name PLUGIN_NAME
			isolate_namespace WidgetGamification
		end
	end

	SiteSetting.class_eval do
		@choices[:layouts_sidebar_left_widgets].push('widget-gamification')
	end

	class WidgetGamification::GamificationController < ::ApplicationController
		skip_before_filter :preload_json, :check_xhr

		def zeroTrustLevel
			user_id = params[:user_id].to_i

			sql = "SELECT * FROM user_stats WHERE user_id = #{user_id}"
			user_stats = ActiveRecord::Base.connection.execute(sql)

			sql = "SELECT * FROM user_badges WHERE user_id = #{user_id}"
			user_badges = ActiveRecord::Base.connection.execute(sql)

			sql = "SELECT * FROM categories WHERE slug = 'gamification-hints'"
			hint_categoriy = ActiveRecord::Base.connection.execute(sql)
			hint_categoriy_id = hint_categoriy[0]["id"].to_i

			sql = "SELECT * FROM topics WHERE category_id = #{hint_categoriy_id} AND title LIKE '%tl_0%'"
			hint_topic = ActiveRecord::Base.connection.execute(sql)

			sql = "SELECT * FROM posts WHERE topic_id = #{hint_topic[0]["id"]}"
			hints = ActiveRecord::Base.connection.execute(sql)

			max_rang = hints.count - 1
			reply_range = (0..max_rang)
			num = rand(reply_range)

			result = {
				'badges' => user_badges,
				'stats' => user_stats[0],
				'hint' => hints[num]["raw"]
			}

			render json: result
		end

		def checkComplete user_id
			todo = "complete"

			sql = "SELECT * FROM user_fields WHERE name = 'مدل ذهنی'"
			user_field_id = ActiveRecord::Base.connection.execute(sql)

			sql = "SELECT value FROM user_custom_fields WHERE user_id = #{user_id} AND name = 'user_field_#{user_field_id[0]["id"]}'"
			user_field_value = ActiveRecord::Base.connection.execute(sql)

			if user_field_value.count < 1 || user_field_value[0]["value"] == ""
				help = 1
			else
				help = 0
			end

			#if user has chosen his personality
			if help == 0

				#find user's properities
				sql = "SELECT * FROM users WHERE id = #{user_id}"
				user = ActiveRecord::Base.connection.execute(sql)

				#user expertis

				sql = "SELECT * FROM user_fields WHERE name = 'تخصص'"
				user_expert = ActiveRecord::Base.connection.execute(sql)

				sql = "SELECT value FROM user_custom_fields WHERE user_id = #{user_id} AND name = 'user_field_#{user_expert[0]["id"]}'"
				user_expert_value = ActiveRecord::Base.connection.execute(sql)

				#user location

				sql = "SELECT * FROM user_fields WHERE name = 'موقعیت مکانی'"
				user_location = ActiveRecord::Base.connection.execute(sql)

				sql = "SELECT value FROM user_custom_fields WHERE user_id = #{user_id} AND name = 'user_field_#{user_location[0]["id"]}'"
				user_location_value = ActiveRecord::Base.connection.execute(sql)

				#calculationg what should ask from user, for better performance, This is in back-end

				if user[0]["name"] == ""

					todo = "name"

				elsif user[0]["date_of_birth"] == nil
					
					todo = "date_of_birth"

				elsif user_expert_value.count < 1 || user_expert_value[0]["value"] == ""

					todo = "expertis"

				elsif user_location_value.count < 1 || user_location_value[0]["value"] == ""
					
					todo = "location"
					
				elsif user[0]["uploaded_avatar_id"] == nil

					todo = "avatar"
				end
				
				if todo == "complete"

					result = {
						'state' => true
					}

					return result

				else

					result = {
						'state' => false,
						'todo' => todo
					}

					return result
					
					
				end

			else
				result = {
					'state' => false
				}

				return result

			end
		end

		def firstTrustLevel
			user_id = params[:user_id].to_i
			todo = "complete"

			sql = "SELECT * FROM user_badges WHERE user_id = #{user_id}"
			user_badges = ActiveRecord::Base.connection.execute(sql)

			badge_exist = user_badges.find{|badge| badge["badge_id"].to_i == 5}

			if badge_exist == nil

				result = {
					'no_badge' => true
				}
				render json: result
				return

			end

			sql = "SELECT * FROM user_fields WHERE name = 'مدل ذهنی'"
			user_field_id = ActiveRecord::Base.connection.execute(sql)

			sql = "SELECT value FROM user_custom_fields WHERE user_id = #{user_id} AND name = 'user_field_#{user_field_id[0]["id"]}'"
			user_field_value = ActiveRecord::Base.connection.execute(sql)

			if user_field_value.count < 1 || user_field_value[0]["value"] == ""
				help = 1
			else
				help = 0
			end

			#if user has chosen his personality
			if help == 0

				#find tip's category
				sql = "SELECT * FROM categories WHERE slug = 'gamification-hints'"
				hint_categoriy = ActiveRecord::Base.connection.execute(sql)
				hint_categoriy_id = hint_categoriy[0]["id"].to_i

				#find tip's topic
				sql = "SELECT * FROM topics WHERE category_id = #{hint_categoriy_id} AND title LIKE '%tl_1%'"
				hint_topic = ActiveRecord::Base.connection.execute(sql)

				#find tip's posts
				sql = "SELECT * FROM posts WHERE topic_id = #{hint_topic[0]["id"]}"
				hints = ActiveRecord::Base.connection.execute(sql)

				max_rang = hints.count - 1
				reply_range = (0..max_rang)
				num = rand(reply_range)

				#find user's properities
				sql = "SELECT * FROM users WHERE id = #{user_id}"
				user = ActiveRecord::Base.connection.execute(sql)

				#user expertis

				sql = "SELECT * FROM user_fields WHERE name = 'تخصص'"
				user_expert = ActiveRecord::Base.connection.execute(sql)

				sql = "SELECT value FROM user_custom_fields WHERE user_id = #{user_id} AND name = 'user_field_#{user_expert[0]["id"]}'"
				user_expert_value = ActiveRecord::Base.connection.execute(sql)

				#user location

				sql = "SELECT * FROM user_fields WHERE name = 'موقعیت مکانی'"
				user_location = ActiveRecord::Base.connection.execute(sql)

				sql = "SELECT value FROM user_custom_fields WHERE user_id = #{user_id} AND name = 'user_field_#{user_location[0]["id"]}'"
				user_location_value = ActiveRecord::Base.connection.execute(sql)

				#calculationg what should ask from user, for better performance, This is in back-end

				if user[0]["name"] == ""

					todo = "name"

				elsif user[0]["date_of_birth"] == nil
					
					todo = "date_of_birth"

				elsif user_expert_value.count < 1 || user_expert_value[0]["value"] == ""

					todo = "expertis"

				elsif user_location_value.count < 1 || user_location_value[0]["value"] == ""
					
					todo = "location"
					
				elsif user[0]["uploaded_avatar_id"] == nil

					todo = "avatar"
				end


				status = {}
				if todo == "complete"

					btime = Time.new
					etime = btime - 30*24*3600

					btime = btime.strftime("%Y-%m-%d")
					etime = etime.strftime("%Y-%m-%d")

					sql = "SELECT SUM(like_count) FROM topics WHERE user_id = #{user_id}"
					total_like_count = ActiveRecord::Base.connection.execute(sql)

					sql = "SELECT * FROM group_users WHERE group_id = 124"
					top_users = ActiveRecord::Base.connection.execute(sql)

					top_users_count = top_users.count - 1
					top_users_range = (0..top_users_count)
					counter = 0
					for i in top_users_range
						sql = "SELECT SUM(like_count) FROM topics WHERE user_id = #{top_users[i]['user_id']}"
						top_users_like_count = ActiveRecord::Base.connection.execute(sql)
						counter += top_users_like_count[0]['sum'].to_i
					end
					todo = "status"
					x = total_like_count[0]['sum'].to_i
					norm = ((x * x * x)/96000) - ((x * x)/200) + (263*x/240) + 30
					status = {
						"total_like_count" => total_like_count[0]['sum'],
						"top_user" => counter/top_users_count,
						"norm" => norm
					}

				end
				

				result = {
					'state' => true,
					'result' => user_field_value[0],
					'hint' => hints[num]["raw"],
					'todo' => todo,
					'status' => status
				}
				render json: result
			else
				result = {
					'state' => false,
				}
				render json: result
			end

		end

		def setPersonality
			user_id = params[:user_id].to_i
			personality = params[:personality].to_s

			sql = "SELECT * FROM user_fields WHERE name = 'مدل ذهنی'"
			user_field_id = ActiveRecord::Base.connection.execute(sql)

			sql = "SELECT * FROM user_custom_fields WHERE user_id = #{user_id} AND name = 'user_field_#{user_field_id[0]["id"]}'"
			existance = ActiveRecord::Base.connection.execute(sql)

			if existance.count < 1

				newField = UserCustomField.create(user_id: user_id, name: "user_field_#{user_field_id[0]["id"]}", value: "#{personality}")

			else

				oldField = UserCustomField.where(user_id: user_id, name: "user_field_#{user_field_id[0]["id"]}").first
				oldField.value = "#{personality}"
				oldField.save

			end
			result = {
				state: true
			}
			render json: result
		end

		def setName
			user_id = params[:user_id].to_i
			username = params[:name].to_s		#user's name

			theUser = User.where(id: user_id).first
			theUser.name = username
			theUser.save

			render json: theUser
		end

		def setBirth
			user_id = params[:user_id].to_i
			userbirth = params[:birth].to_s

			# sql = "UPDATE users SET date_of_birth ='#{userbirth}' WHERE id = #{user_id}"
			# result = ActiveRecord::Base.connection.execute(sql)
			# render json: result

			theUser = User.where(id: user_id).first
			theUser.date_of_birth = userbirth
			theUser.save

			render json: theUser
		end

		def setExpertis
			user_id = params[:user_id].to_i
			userexpertis = params[:expertis].to_s

			sql = "SELECT * FROM user_fields WHERE name = 'تخصص'"
			user_expert = ActiveRecord::Base.connection.execute(sql)

			puts "**********"
			sql = "SELECT * FROM user_custom_fields WHERE user_id = #{user_id} AND name = 'user_field_#{user_expert[0]["id"]}'"
			user_expert_existance = ActiveRecord::Base.connection.execute(sql)

			if user_expert_existance.count < 1

				thisField = UserCustomField.create(user_id: user_id, name: "user_field_#{user_expert[0]["id"]}", value: "#{userexpertis}")

			else
		
				puts "user_field_#{user_expert[0]["id"]}"
				thisField = UserCustomField.where(user_id: user_id, name: "user_field_#{user_expert[0]["id"]}").first
				thisField.value = "#{userexpertis}"
				thisField.save
			end

			
			render json: thisField
		end

		def setLocation
			user_id = params[:user_id].to_i
			userlocation = params[:location].to_s

			sql = "SELECT * FROM user_fields WHERE name = 'موقعیت مکانی'"
			user_location = ActiveRecord::Base.connection.execute(sql)
			puts user_location[0]["id"]
			sql = "SELECT * FROM user_custom_fields WHERE user_id = #{user_id} AND name = 'user_field_#{user_location[0]["id"]}'"
			user_location_existance = ActiveRecord::Base.connection.execute(sql)

			if user_location_existance.count < 1

				thisField = UserCustomField.create(user_id: user_id, name: "user_field_#{user_location[0]["id"]}", value: "#{userlocation}")

			else

				thisField = UserCustomField.where(user_id: user_id, name: "user_field_#{user_location[0]["id"]}").first
				thisField.value = "#{userlocation}"
				thisField.save
				
			end


			render json: thisField
		end

		def secondTrustLevel
			user_id = params[:user_id].to_i

			check = checkComplete(user_id)
			state = check['state']

			if state == false
				render json: check
				return
			end
			sql = "SELECT * FROM group_users WHERE group_id = 124 and user_id = #{user_id}"
			top = ActiveRecord::Base.connection.execute(sql)
			if top.count > 0
				sql = "SELECT * FROM user_badges WHERE user_id = #{user_id} AND badge_id = 18"
				good_question = ActiveRecord::Base.connection.execute(sql)
				good_question_count = good_question.count

				sql = "SELECT * FROM user_badges WHERE user_id = #{user_id} AND badge_id = 6"
				good_answer = ActiveRecord::Base.connection.execute(sql)
				good_answer_count = good_answer.count

				sql = "SELECT * FROM user_stats WHERE user_id = #{user_id}"
				user = ActiveRecord::Base.connection.execute(sql)

				result = {
					"state" => true,
					"is_top_user" => true,
					"good_answer" => good_answer_count,
					"good_question" => good_question_count,
					"efficient" => (user[0]["likes_received"].to_i)/(user[0]["post_count"].to_i)
				}

				render json: result
			else
				sql = "SELECT SUM(like_count) FROM topics WHERE user_id = #{user_id}"
				total_like_count = ActiveRecord::Base.connection.execute(sql)

				sql = "SELECT * FROM group_users WHERE group_id = 124"
				top_users = ActiveRecord::Base.connection.execute(sql)

				top_users_count = top_users.count - 1
				top_users_range = (0..top_users_count)
				counter = 0
				for i in top_users_range
					sql = "SELECT SUM(like_count) FROM topics WHERE user_id = #{top_users[i]['user_id']}"
					top_users_like_count = ActiveRecord::Base.connection.execute(sql)
					counter += top_users_like_count[0]['sum'].to_i
				end
				todo = "status"
				x = total_like_count[0]['sum'].to_i
				norm = ((x * x * x)/96000) - ((x * x)/200) + (263*x/240) + 30
				result = {
					"state" => true,
					"is_top_user" => false,
					"total_like_count" => total_like_count[0]['sum'],
					"top_user" => counter/top_users_count,
					"norm" => norm
				}
				render json: result
			end

		end

	end

	Discourse::Application.routes.prepend do
		mount ::WidgetGamification::Engine, at: "/gamification"
	end

	WidgetGamification::Engine.routes.draw do
		get "Xd5TwdgW.json" => "gamification#zeroTrustLevel"
		get "te2Fgd5XvAZ.json" => "gamification#firstTrustLevel"
		get "chaDgoeAg5sSaG" => "gamification#setPersonality"
		get "Xz54dw5fGwe4g5.json" => "gamification#secondTrustLevel"
		get "cQ5sdGr2eFGfsF2" => "gamification#setName"
		get "AsdGEgDvBNAgWOFKASF" => "gamification#setBirth"
		get "sdv43GSDGr34ZxasfEw" => "gamification#setExpertis"
		get "csAfGE45fSe56XZvsdf4g" => "gamification#setLocation"
	end
end
